# QuizMe Reset Automation

## Demonstration Video

Watch this video to see the QuizMe Reset Automation in action:

### add video here

## Overview
This project automates the process of resetting question priorities on the QuizMe website using Selenium WebDriver. It provides a GUI interface built with Tkinter, allowing users to:

- Input the QuizMe URL to automate.
- Run automation for resetting all question priorities to "Regular".
- Switch between English and Hebrew language for the interface.

## Features
- User-friendly GUI for automation.
- Language toggle between English and Hebrew.
- Selenium-based browser automation.
- Ensures users are logged in before automation starts.
- Handles pagination to reset priorities across all pages.

## Requirements
- **Python 3.8 or later**
- **Google Chrome** installed
- Required Python libraries (see below)

### Installation Instructions

If the project is hosted on a Git repository:

1. **Clone the Repository**:
   - Open a terminal or command prompt and run the following command:
     ```bash
     git clone https://[github.com/manuelruff/quizme-reset](https://github.com/manuelruff/quizme-reset)
     cd quizme-reset/selenium_proj
     ```

2. **Install Required Libraries**:
   - Run the following command to install the necessary libraries:
     ```bash
     pip install -r requirements.txt
     ```

3. **Run the Program**:
   - If Python is installed on your computer:
     ```bash
     python src/main.py
     ```
   - If you have an `.exe` file, simply double-click the `.exe` file to run the program.

## How to Use

### Step 1: Launch the Application
Run the \`main.py\` file. A GUI window will open.

### Step 2: Enter the URL
Enter the QuizMe URL where the automation will run.

### Step 3: Start Automation
Click the "Start" button:
1. The browser will open, and you will be prompted to log in manually.
2. Once logged in, the automation will reset all question priorities to "Regular" across all pages.

### Step 4: Completion
Once automation is complete, a message box will confirm success.

### Switching Language
To switch between English and Hebrew, click the "Hebrew" or "English" button at the bottom of the GUI.

## Packaging to an Executable
   ```bash
   pyinstaller --noconfirm --onefile --windowed src/main.py
   ```

The `.exe` file will be located in the `dist/` folder.

## Acknowledgments
- Built using Selenium for web automation.
- Tkinter for GUI development.
- WebDriver Manager for managing ChromeDriver.
