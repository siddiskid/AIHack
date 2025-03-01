import tkinter as tk
from tkinter import scrolledtext, filedialog, messagebox
import whisper
import pyaudio
import numpy as np
import torch
import wave
import threading
import os
import datetime
import subprocess

class TranscriptionGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Real-time Whisper Transcription")
        self.root.geometry("800x600")
        
        # Create transcriptions folder if it doesn't exist
        self.transcriptions_folder = "transcriptions"
        if not os.path.exists(self.transcriptions_folder):
            os.makedirs(self.transcriptions_folder)
        
        # Initialize Whisper model
        self.model = whisper.load_model("small")
        
        # Audio settings
        self.FORMAT = pyaudio.paInt16
        self.CHANNELS = 1
        self.RATE = 16000
        self.CHUNK = 1024
        self.recording = False
        
        # Initialize PyAudio
        self.audio = pyaudio.PyAudio()
        
        # Create GUI elements
        self.create_widgets()
        
        # Initialize recording variables
        self.frames = []
    
    def create_widgets(self):
        # Create and pack the control frame
        control_frame = tk.Frame(self.root)
        control_frame.pack(pady=10)
        
        # Create the record button
        self.record_button = tk.Button(
            control_frame,
            text="Start Recording",
            command=self.toggle_recording,
            width=15,
            height=2
        )
        self.record_button.pack(side=tk.LEFT, padx=5)
        
        # Create the save button
        self.save_button = tk.Button(
            control_frame,
            text="Save Transcription",
            command=self.save_transcription,
            width=15,
            height=2
        )
        self.save_button.pack(side=tk.LEFT, padx=5)
        
        # Create the open folder button
        self.folder_button = tk.Button(
            control_frame,
            text="Open Transcriptions",
            command=self.open_transcriptions_folder,
            width=15,
            height=2
        )
        self.folder_button.pack(side=tk.LEFT, padx=5)
        
        # Create the text area for transcription
        self.text_area = scrolledtext.ScrolledText(
            self.root,
            wrap=tk.WORD,
            width=70,
            height=30,
            state='disabled'  # Make it read-only
        )
        self.text_area.pack(padx=10, pady=10, expand=True, fill='both')
    
    def open_transcriptions_folder(self):
        """Open the transcriptions folder in file explorer"""
        try:
            # Handle different operating systems
            if os.name == 'nt':  # Windows
                os.startfile(self.transcriptions_folder)
            elif os.name == 'posix':  # macOS and Linux
                subprocess.run(['xdg-open' if os.system('which xdg-open') == 0 else 'open', self.transcriptions_folder])
        except Exception as e:
            messagebox.showerror("Error", f"Could not open transcriptions folder: {str(e)}")
    
    def toggle_recording(self):
        if not self.recording:
            # Start recording
            self.recording = True
            self.record_button.config(text="Stop Recording", bg="red")
            self.frames = []
            
            # Start recording in a separate thread
            self.record_thread = threading.Thread(target=self.record_audio)
            self.record_thread.start()
            
            # Start transcription in a separate thread
            self.transcribe_thread = threading.Thread(target=self.transcribe_audio)
            self.transcribe_thread.start()
        else:
            # Stop recording
            self.recording = False
            self.record_button.config(text="Start Recording", bg="SystemButtonFace")
    
    def record_audio(self):
        stream = self.audio.open(
            format=self.FORMAT,
            channels=self.CHANNELS,
            rate=self.RATE,
            input=True,
            frames_per_buffer=self.CHUNK
        )
        
        while self.recording:
            data = stream.read(self.CHUNK)
            self.frames.append(data)
        
        stream.stop_stream()
        stream.close()
    
    def transcribe_audio(self):
        while self.recording:
            if len(self.frames) > int(self.RATE * 2 / self.CHUNK):  # Process every 2 seconds
                # Save current audio chunk
                with wave.open("temp.wav", "wb") as wf:
                    wf.setnchannels(self.CHANNELS)
                    wf.setsampwidth(self.audio.get_sample_size(self.FORMAT))
                    wf.setframerate(self.RATE)
                    wf.writeframes(b''.join(self.frames[-int(self.RATE * 2 / self.CHUNK):]))
                
                # Transcribe
                try:
                    result = self.model.transcribe("temp.wav", fp16=torch.cuda.is_available())
                    
                    # Update text area
                    self.text_area.config(state='normal')  # Temporarily enable for insertion
                    self.text_area.insert(tk.END, result["text"] + "\n")
                    self.text_area.config(state='disabled')  # Make read-only again
                    self.text_area.see(tk.END)  # Scroll to the bottom
                except Exception as e:
                    print(f"Transcription error: {str(e)}")
                
                # Clean up
                if os.path.exists("temp.wav"):
                    os.remove("temp.wav")
    
    def save_transcription(self):
        # Get the current transcription text
        self.text_area.config(state='normal')
        text_content = self.text_area.get(1.0, tk.END)
        self.text_area.config(state='disabled')
        
        # Generate default filename with timestamp
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        default_filename = f"transcription_{timestamp}.txt"
        default_path = os.path.join(self.transcriptions_folder, default_filename)
        
        # Open file dialog to choose save location, starting in transcriptions folder
        file_path = filedialog.asksaveasfilename(
            initialdir=self.transcriptions_folder,
            initialfile=default_filename,
            defaultextension=".txt",
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")],
            title="Save Transcription As"
        )
        
        if file_path:
            try:
                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(text_content)
                tk.messagebox.showinfo("Success", "Transcription saved successfully!")
            except Exception as e:
                tk.messagebox.showerror("Error", f"Failed to save transcription: {str(e)}")

def main():
    root = tk.Tk()
    app = TranscriptionGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main() 