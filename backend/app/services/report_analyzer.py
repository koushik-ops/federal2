import re

def extract_medical_values(text):

    extracted = {}

    text = text.lower()

    patterns = {
        "Glucose": [
            r'glucose[:\s]+(\d+)',
            r'blood sugar[:\s]+(\d+)',
            r'fasting glucose[:\s]+(\d+)'
        ],

        "BloodPressure": [
            r'blood pressure[:\s]+(\d+)',
            r'bp[:\s]+(\d+)'
        ],

        "BMI": [
            r'bmi[:\s]+([0-9.]+)',
            r'body mass index[:\s]+([0-9.]+)'
        ],
        "Age": [
            r'\bage\b[:\s]+(\d+)',
            r'(\d+)\s*years?\s+old',
            r'age[:\s]+(\d+)\s*(?:yrs?|years?)',
        ],
        "Insulin": [
            r'insulin[:\s]+(\d+(?:\.\d+)?)',
            r'serum\s+insulin[:\s]+(\d+(?:\.\d+)?)',
        ],
        "SkinThickness": [
            r'skin\s+thickness[:\s]+(\d+(?:\.\d+)?)',
            r'triceps[:\s]+(\d+(?:\.\d+)?)',
        ],
        "DiabetesPedigreeFunction": [
            r'diabetes\s+pedigree[:\s]+(\d+(?:\.\d+)?)',
            r'dpf[:\s]+(\d+(?:\.\d+)?)',
        ],
        "Pregnancies": [
            r'pregnancies?[:\s]+(\d+)',
            r'gravida[:\s]+(\d+)',
        ],
        # Liver-specific
        "Bilirubin": [
            r'total\s+bilirubin[:\s]+(\d+(?:\.\d+)?)',
            r'bilirubin[:\s]+(\d+(?:\.\d+)?)',
        ],
        "ALT": [
            r'\balt\b[:\s]+(\d+(?:\.\d+)?)',
            r'alamine\s+aminotransferase[:\s]+(\d+(?:\.\d+)?)',
            r'sgpt[:\s]+(\d+(?:\.\d+)?)',
        ],
        "AST": [
            r'\bast\b[:\s]+(\d+(?:\.\d+)?)',
            r'aspartate\s+aminotransferase[:\s]+(\d+(?:\.\d+)?)',
            r'sgot[:\s]+(\d+(?:\.\d+)?)',
        ],
        # Kidney-specific
        "Creatinine": [
            r'creatinine[:\s]+(\d+(?:\.\d+)?)',
            r'serum\s+creatinine[:\s]+(\d+(?:\.\d+)?)',
        ],
        "Hemoglobin": [
            r'hemo(?:globin)?[:\s]+(\d+(?:\.\d+)?)',
            r'\bhgb\b[:\s]+(\d+(?:\.\d+)?)',
        ],
    }
    for feature, regex_list in patterns.items():
        extracted[feature] = 0
        for pattern in regex_list:
            match = re.search(pattern, text)
            if match:

                value = match.group(1)

                if "." in value:
                    extracted[feature] = float(value)
                else:
                    extracted[feature] = int(value)

                break

    return extracted