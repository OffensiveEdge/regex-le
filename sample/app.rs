// Sample Rust file for Regex-LE testing
// Test patterns: /fn\s+(\w+)/g, /struct\s+(\w+)/g, /enum\s+(\w+)/g

use std::io;
use std::net::{TcpListener, TcpStream};

// Struct definitions
struct User {
    id: u32,
    name: String,
    email: String,
}

struct Config {
    port: u16,
    host: String,
    database: String,
}

// Enum definitions
enum Status {
    Active,
    Inactive,
    Pending,
}

enum Color {
    Red,
    Green,
    Blue,
}

// Function definitions
fn calculate_total(items: &[Item]) -> f64 {
    items.iter().map(|item| item.price).sum()
}

fn process_user_data(user_id: u32) -> Result<User, io::Error> {
    let url = format!("/api/users/{}", user_id);
    // Process request
    Ok(User {
        id: user_id,
        name: "John".to_string(),
        email: "john@example.com".to_string(),
    })
}

async fn fetch_data(url: &str) -> Result<String, io::Error> {
    // Async implementation
    Ok("data".to_string())
}

// Implementation blocks
impl User {
    fn get_name(&self) -> &str {
        &self.name
    }
    
    fn set_email(&mut self, email: String) {
        self.email = email;
    }
}

// Constants
const MAX_USERS: u32 = 1000;
const API_VERSION: &str = "2.0.1";
const DEFAULT_PORT: u16 = 8080;

// Static variables
static APP_NAME: &str = "MyApplication";
static API_URL: &str = "https://api.example.com/v1";

// String literals
let message = format!("User {} connected", user_id);
let path = format!("/api/v1/users/{}", user_id);

// Comments
// TODO: Refactor authentication
// FIXME: Handle error case
// NOTE: Needs optimization

