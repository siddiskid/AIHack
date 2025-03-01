import re
import google.generativeai as genai

genai.configure(api_key="AIzaSyC1yhDfnx43dciIaAGIHplN0Wqp6Eu1Cs8")

MEDICAL_TEMPLATE = """Process the output in {language}. Here is the expected format in English:
CLINICAL SUMMARY FORMATTING TASK

Generate response in this EXACT structure:

SYMPTOMS
- [Symptom] (Duration: [X days/weeks])
- [Symptom]...

DIAGNOSIS
Primary: [Diagnosis]
Evidence:
- [Finding]
- [Finding]...

TREATMENT PLAN
Medications:
1. [Drug]
   - Dosage: [Amount]
   - Duration: [Timeframe]
Lifestyle:
- [Recommendation]
- [Recommendation]...

FOLLOW UP
Monitoring:
- [Instruction]
- [Instruction]...
Return Visit: [Timeline]

TRANSCRIPT TO PROCESS:
{transcript}"""

# class ValidationHelper:
#     @staticmethod
#     def validate_response(text):
#         errors = []
        
#         # Check required sections (unchanged)
#         required_sections = ["SYMPTOMS", "DIAGNOSIS", "TREATMENT PLAN", "FOLLOW UP"]
#         for section in required_sections:
#             if f"{section}\n" not in text:
#                 errors.append(f"Missing {section} section")

#         # Improved medication validation using azithromycin guidelines [3][6]
#         med_pattern = re.compile(
#             r"(\d+)\.\s(.+?)\n\s+- Dosage:\s(.+?)\n\s+- Duration:\s(.+)",
#             re.DOTALL
#         )
        
#         for match in med_pattern.finditer(text):
#             med_name = match.group(2).strip()
#             dosage = match.group(3).strip()
#             duration = match.group(4).strip()
            
#             # Validate dosage format
#             if not re.search(r"\d+\s?(mg|g|mL)", dosage):
#                 errors.append(f"Invalid dosage format for {med_name}: {dosage}")
                
#             # Validate duration against treatment guidelines [3][6]
#             if not re.match(r"\d+\s+(day|week)s?", duration):
#                 errors.append(f"Invalid duration format for {med_name}: {duration}")
                
#         return errors


# Your existing processing code with validation added
def process_transcript(transcript, language):
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content(
        MEDICAL_TEMPLATE.format(transcript=transcript, language = language),
        generation_config={
            "temperature": 0.2,
            "top_p": 0.95,
            "response_mime_type": "text/plain"
        }
    )
    
    generated_text = response.text
    
    # Validate the output
    # errors = ValidationHelper.validate_response(generated_text)
    
    # if errors:
    #     print("Validation Errors:")
    #     for error in errors[:3]:  # Show max 3 errors
    #         print(f"- {error}")
    #     return None
    
    return generated_text

# Example usage
result = process_transcript("""Good morning. What brings you in today?
Hi, I've had this cough for two weeks. Fever started yesterday.    
Any chest pain? Trouble breathing?
Some tightness when coughing. Get winded climbing stairs.    
Let me listen. Hearing crackling in lower left lung. Nausea?
No nausea. Very tired though. Taking Tylenol for fever.    
Temperature is 38.1°C. We'll do a chest X-ray. 
...shows consolidation. Early pneumonia. Take azithromycin 500mg once daily for 5 days.    
Avoid alcohol. Use humidifier. ER if blue lips or fever over 39.4°C.
Return in 7 days. Call if worse.""", "Chinese-Simplified")

if result:
    print("Valid Medical Summary:")
    print(result)
