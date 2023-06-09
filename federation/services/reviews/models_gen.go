// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package reviews

type Product struct {
	Upc     string    `json:"upc"`
	Reviews []*Review `json:"reviews,omitempty"`
}

func (Product) IsEntity() {}

type Review struct {
	ID      string   `json:"id"`
	Body    *string  `json:"body,omitempty"`
	Author  *User    `json:"author,omitempty"`
	Product *Product `json:"product,omitempty"`
}

func (Review) IsEntity() {}

type User struct {
	ID       string    `json:"id"`
	Username *string   `json:"username,omitempty"`
	Reviews  []*Review `json:"reviews,omitempty"`
}

func (User) IsEntity() {}
