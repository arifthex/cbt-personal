package handlers

import (
	"cbt-api/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ExamHandler struct {
	service *services.ExamService
}

func NewExamHandler() *ExamHandler {
	return &ExamHandler{
		service: services.NewExamService(),
	}
}

func (h *ExamHandler) GetAllExams(c *gin.Context) {
	exams := h.service.GetAll()
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   exams,
	})
}

func (h *ExamHandler) GetExamByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid exam id"})
		return
	}
	exam, err := h.service.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "exam not found"})
		return
	}
	c.JSON(http.StatusOK, exam)
}
