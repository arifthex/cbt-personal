package models

type Exam struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	Duration int    `json:"duration"` // in minutes
}
