import tkinter as tk
from tkinter import messagebox
from translations import translations
from automation import start_automation

current_language = "English"

def switch_language(app, labels, buttons):
    """Switch between English and Hebrew."""
    global current_language
    current_language = "Hebrew" if current_language == "English" else "English"
    update_labels(app, labels, buttons)

def update_labels(app, labels, buttons):
    """Update all text labels to match the current language."""
    app.title(translations[current_language]["title"])
    labels['url_label'].config(text=translations[current_language]["url_label"])
    buttons['start_button'].config(text=translations[current_language]["start_button"])
    buttons['switch_button'].config(text=translations[current_language]["switch_button"])

def adjust_font(labels, buttons):
    """Dynamically adjust font sizes based on window size."""
    # Get window dimensions
    width = app.winfo_width()
    height = app.winfo_height()

    # Calculate a font size proportional to the window size
    new_size = int(min(width, height) / 25)
    new_font = ("Arial", max(new_size, 10))  # Minimum font size of 10

    # Apply new font size
    labels['url_label'].config(font=new_font)
    buttons['start_button'].config(font=new_font)
    buttons['switch_button'].config(font=new_font)

def on_resize(event, labels, buttons):
    """Handle window resize event to adjust font size."""
    adjust_font(labels, buttons)

def create_app():
    """Create and launch the Tkinter GUI."""
    global current_language, app
    app = tk.Tk()
    app.title(translations[current_language]["title"])
    app.geometry("400x250")
    app.configure(bg="#f0f0f0")

    # Configure window to resize dynamically
    app.columnconfigure(0, weight=1)
    app.rowconfigure(0, weight=1)  # Input frame
    app.rowconfigure(1, weight=1)  # Button frame

    default_font = ("Arial", 12)

    input_frame = tk.Frame(app, bg="#f0f0f0", padx=20, pady=10)
    input_frame.grid(row=0, column=0, sticky="ew")
    input_frame.columnconfigure(0, weight=1)

    button_frame = tk.Frame(app, bg="#f0f0f0", padx=20, pady=10)
    button_frame.grid(row=1, column=0, sticky="ew")
    button_frame.columnconfigure(0, weight=1)

    labels = {}
    labels['url_label'] = tk.Label(input_frame, text=translations[current_language]["url_label"], font=default_font, bg="#f0f0f0")
    labels['url_label'].grid(row=0, column=0, sticky="w", pady=5)

    url_entry = tk.Entry(input_frame, font=default_font, highlightbackground="#d3d3d3", highlightthickness=1, relief="flat")
    url_entry.grid(row=1, column=0, sticky="ew", pady=5)

    buttons = {}
    buttons['start_button'] = tk.Button(button_frame, text=translations[current_language]["start_button"], font=default_font,
                                        command=lambda: start_automation(url_entry.get(), app, messagebox, current_language),
                                        bg="#0078D7", fg="white", activebackground="#005BB5", activeforeground="white", relief="flat")
    buttons['start_button'].grid(row=0, column=0, sticky="ew", pady=5)

    buttons['switch_button'] = tk.Button(button_frame, text=translations[current_language]["switch_button"], font=default_font,
                                         command=lambda: switch_language(app, labels, buttons),
                                         bg="#E5E5E5", fg="black", activebackground="#C4C4C4", relief="flat")
    buttons['switch_button'].grid(row=1, column=0, sticky="ew", pady=5)

    # Bind resize event
    app.bind("<Configure>", lambda e: on_resize(e, labels, buttons))

    adjust_font(labels, buttons)  # Initial adjustment
    app.mainloop()
