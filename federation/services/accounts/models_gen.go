// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package accounts

type User struct {
	ID       string  `json:"id"`
	Name     *string `json:"name"`
	Username *string `json:"username"`
}

func (User) IsEntity() {}