// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::{
    Manager, menu::{Menu, MenuItem}, tray::TrayIconBuilder, WindowEvent
};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {

            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let settings_i = MenuItem::with_id(app, "settings", "Settings", true, None::<&str>)?;
            
            let menu = Menu::with_items(app, &[&quit_i, &settings_i])?;

            let app_handle = app.handle().clone();

            if let Some(settings) = app.get_webview_window("settings") {
                settings.on_window_event(move |event| {
                    if let WindowEvent::CloseRequested { api, .. } = event {
                        api.prevent_close();
                        if let Some(win) = app_handle.get_webview_window("settings") {
                            win.hide().unwrap();
                        }
                    }
                });
            }


            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                        println!("quit menu item was clicked");
                       
                        app.exit(0);
                    }
                    "settings" => {
                        println!("settings menu item was clicked");

                        if let Some(window) = app.get_webview_window("settings") {
                            
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }
                    }
                    //FIXME When I open and then close settings window it does not reopen.
                    _ => {
                        println!("menu item {:?} not handled", event.id);
                    }
                })
                .show_menu_on_left_click(true)
                .build(app)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
