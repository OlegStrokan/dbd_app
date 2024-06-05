package main

import (
	"fmt"
	"new-schema-registry/app/schemas"
)

func main() {
	availableSchemas := schemas.InitSchemas()
	fmt.Println(availableSchemas)
}
