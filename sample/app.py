# Sample Python file for Regex-LE testing
# Test patterns: /def\s+(\w+)/g, /class\s+(\w+)/g, /['"]([^'"`]+)['"`]/g

import os
import json
from typing import List, Dict, Optional
from datetime import datetime

# Function definitions
def calculate_total(items):
    """Calculate total price of items."""
    return sum(item.price for item in items)

def process_user_data(user_id: int) -> Dict:
    """Process user data from API."""
    response = requests.get(f'/api/users/{user_id}')
    return response.json()

async def fetch_data(url: str) -> Optional[str]:
    """Async function to fetch data."""
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

# Class definitions
class UserManager:
    """Manages user operations."""
    
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email
        self.created_at = datetime.now()
    
    def get_name(self) -> str:
        """Get user name."""
        return self.name

class DatabaseConnection:
    """Handles database connections."""
    
    def connect(self):
        """Connect to database."""
        pass

# String values
welcome_message = 'Welcome to the application'
api_url = "https://api.example.com/v1"
template = f"Hello, {name}!"

# Numbers
MAX_USERS = 1000
api_version = '2.0.1'
user_ids = [101, 102, 103, 204, 305]

# Regex patterns
email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
phone_pattern = r'^\+?[\d\s\-\(\)]+$'

# Configuration
config = {
    'static_path': './static',
    'asset_path': '/assets/images',
    'data_path': '../data/records.json'
}

# Comments
# TODO: Refactor authentication
# FIXME: Handle edge case
# NOTE: Needs optimization

