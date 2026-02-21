"""
Test Gemini API Key validity
"""
import os
from dotenv import load_dotenv

# Load environment variables (override any existing OS vars)
load_dotenv(override=True)

try:
    from google import genai
    print("✅ google-genai package is installed")
except ImportError:
    print("❌ google-genai package not installed")
    print("   Run: pip install google-generativeai")
    exit(1)

# Get API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ GEMINI_API_KEY not found in .env file")
    exit(1)

print(f"\n🔑 Testing Gemini API Key: {api_key[:8]}...{api_key[-4:]}")
print(f"   Full length: {len(api_key)} characters")

# Try to initialize client and make a simple request
try:
    client = genai.Client(api_key=api_key)
    print("✅ Client initialized successfully")
    
    # Try a simple generation request
    print("\n🧪 Testing with gemini-2.5-pro model...")
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Say 'Hello, API key is working!' in one sentence."
    )
    
    print("✅ API Key is VALID!")
    print(f"\n📝 Response from Gemini:")
    print(f"   {response.text}")
    
except Exception as e:
    print(f"\n❌ API Key is INVALID or Error occurred:")
    print(f"   Error: {str(e)}")
    print(f"\n💡 To get a valid API key:")
    print(f"   1. Visit: https://aistudio.google.com/app/apikey")
    print(f"   2. Create a new API key")
    print(f"   3. Update GEMINI_API_KEY in your .env file")
