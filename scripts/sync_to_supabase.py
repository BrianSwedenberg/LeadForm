import os
import json
import gspread
from google.oauth2.service_account import Credentials
from supabase import create_client, Client

# --- Auth ---
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
SERVICE_ACCOUNT_JSON = os.environ["GOOGLE_SERVICE_ACCOUNT_JSON"]

# --- Config ---
SPREADSHEET_ID = "1VE8yaSyhVP3u4a8sVR0QZLowoEe7vPWgYJ69rD2Rqag"
SHEET_NAME = "Sheet1"
SUPABASE_TABLE = "ScratchPeople_staging"

# --- Connect to Google Sheets ---
creds_dict = json.loads(SERVICE_ACCOUNT_JSON)
creds = Credentials.from_service_account_info(
    creds_dict,
    scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"]
)
gc = gspread.authorize(creds)
sheet = gc.open_by_key(SPREADSHEET_ID).worksheet(SHEET_NAME)

# --- Pull data ---
rows = sheet.get_all_records()
print(f"Fetched {len(rows)} rows from Google Sheets")

# --- Clean and map rows ---
cleaned_rows = []
skipped = 0

for row in rows:
    # get_all_records() lowercases headers, so sheet "ID" comes in as "id"
    row_id = row.get("id") or row.get("ID")
    
    if not row_id:
        print(f"Skipping row missing ID: {row}")
        skipped += 1
        continue

    cleaned_rows.append({
        "id":        row_id,
        "FirstName": row.get("FirstName", "").strip(),
        "LastName":  row.get("LastName", "").strip(),
        "Address":   row.get("Address", "").strip(),
        "City":      row.get("City", "").strip(),
        "State":     row.get("State", "").strip(),
        "Zip":       str(row["Zip"]).strip() if row.get("Zip") else None,
        "Country":   row.get("Country", "").strip(),
    })

print(f"Prepared {len(cleaned_rows)} rows for upsert, skipped {skipped} invalid rows")

# --- Connect to Supabase ---
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Upsert ---
# ignoreDuplicates=False tells supabase-py to update on conflict
# The primary key (id) is used automatically for conflict detection
try:
    response = supabase.table(SUPABASE_TABLE).upsert(
        cleaned_rows,
        ignore_duplicates=False
    ).execute()
    print(f"Successfully upserted {len(cleaned_rows)} rows into {SUPABASE_TABLE}")
except Exception as e:
    print(f"Upsert failed: {e}")
    raise
