// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package inventory

type Product struct {
	Upc              string `json:"upc"`
	Weight           *int   `json:"weight,omitempty"`
	Price            *int   `json:"price,omitempty"`
	InStock          *bool  `json:"inStock,omitempty"`
	ShippingEstimate *int   `json:"shippingEstimate,omitempty"`
}

func (Product) IsEntity() {}
