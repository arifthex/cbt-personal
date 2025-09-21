package services

import (
	"cbt-api/models"
	"errors"
)

type ExamService struct {
	exams []models.Exam
}

func NewExamService() *ExamService {
	// dummy data
	return &ExamService{
		exams: []models.Exam{
			{ID: 1, Title: "Ujian Matematika", Duration: 90},
			{ID: 2, Title: "Ujian Bahasa Inggris", Duration: 60},
		},
	}
}

func (s *ExamService) GetAll() []models.Exam {
	return s.exams
}

func (s *ExamService) GetByID(id int) (models.Exam, error) {
	for _, exam := range s.exams {
		if exam.ID == id {
			return exam, nil
		}
	}
	return models.Exam{}, errors.New("exam not found")
}
