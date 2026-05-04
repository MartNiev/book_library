package main

import (
	"errors"
	"fmt"
	"net/http"
	"text/template"
	"time"

	"github.com/gin-gonic/gin"
)

type book struct {
	ID       string `json:"id"`    // This json: "id" syntax allows to serialize the data and convert it to JSON. We want lowercase in json.
	Title    string `json:"title"` // The field has a capital letter to be able to access it in other packages.
	Author   string `json:"author"`
	ImageSrc string `json:"imageSrc"`
	Quantity int    `json:"quantity"`
}

// Data structure to represent the books using a slice
var books = []book{
	{ID: "1", Title: "In Search of Lost Time", Author: "Marcel Proust", ImageSrc: "/static/images/in_search_of_lost_time.jpg", Quantity: 2},
	{ID: "2", Title: "The Great Gatsby", Author: "F. Scott Fitzgerald", ImageSrc: "/static/images/the_great_gatsby.jpg", Quantity: 5},
	{ID: "3", Title: "War and Peace", Author: "Leo Tolstoy", ImageSrc: "/static/images/war_and_peace.jpg", Quantity: 6},
	{ID: "4", Title: "The HouseMaid", Author: "Freida McFadden", ImageSrc: "/static/images/the_housemaid.jpg", Quantity: 6},
	{ID: "5", Title: "The Hunger Games", Author: "Suzanne Collins", ImageSrc: "/static/images/the_hunger_games.png", Quantity: 6},
}

// Handles all of the routes to the different books and returns the JSON reprensentation of the book.
func getBooks(c *gin.Context) { // Gin context is all the info from the request and it allows to return a response.
	c.IndentedJSON(http.StatusOK, books) // Creates a JSON with the proper indentation. Sends the status ok and data is JSON books.
}

func checkoutBook(c *gin.Context) {
	id, ok := c.GetQuery("id") // This gets the query parameter from the url with the variable id. (e.g. ?id=1)

	if !ok {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing id query parameter."})
		return
	}

	book, err := getBookById(id)

	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Book not found."})
		return
	}

	if book.Quantity <= 0 {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Book not available."})
		return
	}

	book.Quantity -= 1
	c.IndentedJSON(http.StatusOK, book)
}

func returnBook(c *gin.Context) {
	id, ok := c.GetQuery("id")

	if !ok {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing id query parameter."})
		return
	}

	book, err := getBookById(id)

	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Book not found."})
		return
	}

	book.Quantity += 1
	c.IndentedJSON(http.StatusOK, book)
}

func bookById(c *gin.Context) { // Gets the book that search for
	id := c.Param("id")
	book, err := getBookById(id)

	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Book not found."}) // gin.h allows us to write a custom json response.
		return
	}

	c.IndentedJSON(http.StatusOK, book)
}

func getBookById(id string) (*book, error) { // Checks if the already exists
	for i, b := range books {
		if b.ID == id {
			return &books[i], nil
		}
	}

	return nil, errors.New("book not found")
}

func createBook(c *gin.Context) {
	var newBook book // Creates a variable book instance of the book struct

	if err := c.BindJSON(&newBook); err != nil { // Binds the data from the request json to the new book by passing the newBook pointer.
		return
	}

	books = append(books, newBook) // If not error adds the newBook to the books slice
	c.IndentedJSON(http.StatusCreated, newBook) // Return the newbook to request response
}

func getVersion() string {
	return fmt.Sprintf("%d", time.Now().Unix())
}

func goHome(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{"title": "Home", "version": time.Now().Unix()})
}


func main() {
	router := gin.Default() // Responsible of handling the routes to the endpoints. We this variable we can route to a function.
	router.SetFuncMap(template.FuncMap{"getVersion": getVersion})	

	router.LoadHTMLGlob("templates/*")
	router.Static("/static", "./static")

	router.GET("/books", getBooks) // Creates a the route "/book" that runs the getBooks func
	router.GET("/books/:id", bookById) // :id sets a path parameter that is pass from the frontend
	router.POST("/books", createBook) 
	router.PATCH("/checkout", checkoutBook)
	router.PATCH("/return", returnBook)
	
	router.GET("/", goHome)

	router.Run("localhost:8080") 
}
