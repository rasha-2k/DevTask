package api

import (
	"github.com/gin-gonic/gin"
	"github.com/rasha-2k/devtask/api/handlers"
	"github.com/rasha-2k/devtask/api/middleware"
	"github.com/rasha-2k/devtask/constants"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	api := router.Group("/api")
	{
		// Public routes
		api.GET("/health", handlers.HealthCheck)
		api.POST("/register", handlers.Register)
		api.POST("/login", handlers.Login)

		// Authenticated routes
		auth := api.Group("/")
		auth.Use(middleware.AuthRequired())
		{
			auth.GET("/profile", handlers.GetProfile)

			// Projects CRUD
			projectRoutes(auth)

			// Tasks CRUD
			taskRoutes(auth)
		}

		// Admin-only routes
		admin := api.Group("/admin")
		admin.Use(middleware.AuthRequired(), middleware.AuthorizeRoles(constants.RoleAdmin))
		{
			admin.GET("/users", handlers.ListUsers)
		}
	}

	return router
}

func projectRoutes(rg *gin.RouterGroup) {
	projects := rg.Group("/projects")
	{
		projects.POST("", handlers.CreateProject)
		projects.GET("", handlers.ListProjects)
		projects.GET("/:id", handlers.GetProjectByID)
		projects.PUT("/:id", handlers.UpdateProject)
		projects.DELETE("/:id", handlers.DeleteProject)
	}
}

func taskRoutes(rg *gin.RouterGroup) {
	tasks := rg.Group("/tasks")
	{
		tasks.POST("", handlers.CreateTask)
		tasks.GET("", handlers.ListTasks)
		tasks.GET("/:id", handlers.GetTask)
		tasks.PUT("/:id", handlers.UpdateTask)
		tasks.DELETE("/:id", handlers.DeleteTask)
	}
}
