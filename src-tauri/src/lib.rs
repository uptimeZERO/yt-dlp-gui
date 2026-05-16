use serde::Serialize;
use std::process::Command;

#[derive(Serialize)]
struct YtDlpStatus {
    installed: bool,
    version: Option<String>,
    path: Option<String>,
    error: Option<String>,
}

#[tauri::command]
fn check_yt_dlp() -> YtDlpStatus {
    check_executable("yt-dlp", None)
}

#[tauri::command]
fn locate_yt_dlp() -> Result<YtDlpStatus, String> {
    let path = open_yt_dlp_file_picker()?;
    Ok(check_executable(&path, Some(path.clone())))
}

#[tauri::command]
fn inspect_media(source: &str, executable_path: Option<&str>) -> Result<serde_json::Value, String> {
    let executable = executable_path
        .filter(|path| !path.trim().is_empty())
        .unwrap_or("yt-dlp");

    let output = Command::new(executable)
        .args(["--dump-single-json", "--no-warnings", source])
        .output()
        .map_err(|error| format!("Failed to start yt-dlp: {error}"))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(stderr.trim().to_string());
    }

    serde_json::from_slice(&output.stdout)
        .map_err(|error| format!("Failed to parse yt-dlp output: {error}"))
}

fn check_executable(command: &str, path: Option<String>) -> YtDlpStatus {
    match Command::new(command).arg("--version").output() {
        Ok(output) if output.status.success() => YtDlpStatus {
            installed: true,
            version: Some(String::from_utf8_lossy(&output.stdout).trim().to_string()),
            path,
            error: None,
        },
        Ok(output) => YtDlpStatus {
            installed: false,
            version: None,
            path,
            error: Some(String::from_utf8_lossy(&output.stderr).trim().to_string()),
        },
        Err(error) => YtDlpStatus {
            installed: false,
            version: None,
            path,
            error: Some(error.to_string()),
        },
    }
}

fn open_yt_dlp_file_picker() -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        let output = Command::new("powershell")
            .args([
                "-NoProfile",
                "-Command",
                "Add-Type -AssemblyName System.Windows.Forms; $dialog = New-Object System.Windows.Forms.OpenFileDialog; $dialog.Filter = 'yt-dlp executable|yt-dlp.exe|All files|*.*'; if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { $dialog.FileName }",
            ])
            .output()
            .map_err(|error| format!("Failed to open file picker: {error}"))?;

        return selected_path_from_output(output);
    }

    #[cfg(target_os = "macos")]
    {
        let output = Command::new("osascript")
            .args([
                "-e",
                "POSIX path of (choose file with prompt \"Locate yt-dlp\")",
            ])
            .output()
            .map_err(|error| format!("Failed to open file picker: {error}"))?;

        return selected_path_from_output(output);
    }

    #[cfg(target_os = "linux")]
    {
        let output = Command::new("sh")
            .args([
                "-c",
                "if command -v zenity >/dev/null 2>&1; then zenity --file-selection --title='Locate yt-dlp'; elif command -v kdialog >/dev/null 2>&1; then kdialog --getopenfilename .; else exit 127; fi",
            ])
            .output()
            .map_err(|error| format!("Failed to open file picker: {error}"))?;

        return selected_path_from_output(output);
    }
}

fn selected_path_from_output(output: std::process::Output) -> Result<String, String> {
    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
        return Err(if stderr.is_empty() {
            "No yt-dlp executable selected.".to_string()
        } else {
            stderr
        });
    }

    let path = String::from_utf8_lossy(&output.stdout).trim().to_string();

    if path.is_empty() {
        Err("No yt-dlp executable selected.".to_string())
    } else {
        Ok(path)
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            check_yt_dlp,
            locate_yt_dlp,
            inspect_media
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
