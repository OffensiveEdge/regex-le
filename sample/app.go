// Sample Go file for Regex-LE testing
// Test patterns: /func\s+(\w+)/g, /package\s+(\w+)/g, /type\s+(\w+)/g

package main

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

// Type definitions
type User struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

type Config struct {
	Port     int    `json:"port"`
	Host     string `json:"host"`
	Database string `json:"database"`
}

// Function definitions
func calculateTotal(items []Item) float64 {
	var total float64
	for _, item := range items {
		total += item.Price
	}
	return total
}

func processUserData(userID int) (*User, error) {
	url := fmt.Sprintf("/api/users/%d", userID)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	// Process response
	return &User{}, nil
}

// Methods
func (u *User) GetName() string {
	return u.Name
}

func (c *Config) GetDatabase() string {
	return c.Database
}

// Constants
const (
	MaxUsers    = 1000
	ApiVersion  = "2.0.1"
	DefaultPort = 8080
)

// Variables
var (
	userIDs      = []int{101, 102, 103, 204, 305}
	welcomeMsg   = "Welcome to the application"
	apiURL       = "https://api.example.com/v1"
	configPath   = "./config/app.json"
	staticPath   = "/assets/static"
)

// String values
var message = fmt.Sprintf("User %d connected", len(userIDs))

// Comments
// TODO: Refactor authentication
// FIXME: Handle error case
// NOTE: Needs optimization

