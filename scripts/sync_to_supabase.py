import os
import json
import gspread
from google.oauth2.service_account import Credentials
from supabase import create_client, Client

# --- Auth ---
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
SERVICE_ACCOUNT_JSON = os.environ["GOOGLE_SERVICE_ACCOUNT_JSON"]

# --- Sheet config ---
SPREADSHEET_ID = "1VE8yaSyhVP3u4a8sVR0QZLowoEe7vPWgYJ69rD2Rqag"
SHEET_NAME = "Sheet1"
SUPABASE_TABLE = "your_table_name"  # ← update this to match your Supabase table name

# --- Connect to Google Sheets ---
creds_dict = json.loads(SERVICE_ACCOUNT_JSON)
creds = Credentials.from_service_account_info(
    creds_dict,
    scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"]
)
gc = gspread.authorize(creds)
sheet = gc.open_by_key(SPREADSHEET_ID).worksheet(SHEET_NAME)

# --- Pull and clean data ---
rows = sheet.get_all_records()
print(f"Fetched {len(rows)} rows from Google Sheets")

# Normalize each row to match Supabase column types
cleaned_rows = []
for row in rows:
    cleaned_rows.append({
        "FirstName": row.get("FirstName", ""),
        "LastName":  row.get("LastName", ""),
        "Address":   row.get("Address", ""),
        "City":      row.get("City", ""),
        "State":     row.get("State", ""),
        "Zip":       str(row.get("Zip", "")) if row.get("Zip") != "" else None,
        "Country":   row.get("Country", ""),
    })

# --- Connect to Supabase ---
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Upsert into Supabase ---
response = supabase.table(SUPABASE_TABLE).upsert(cleaned_rows).execute()
print(f"Upserted {len(cleaned_rows)} rows into Supabase")