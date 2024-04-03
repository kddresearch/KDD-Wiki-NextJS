import joi from "joi";
import NavItem from "./nav_item";
// import category from './category';

class Category {
  id: number;
  title: string;
  location: string;
  links: NavItem[];
  categories: Category[];

  constructor(data: any) {
    // Validates the data against the Joi schema, values is the validated data
    const { error, value } = categorySchema.validate(data);

    // IF there is an error, throw an error with the message
    if (error) {
      throw new Error(`Category validation error: ${error.message}`);
    }

    // Assign the validated values to the Category object
    this.id = value.id;
    this.title = value.title;
    this.location = value.location;
    this.links = value.links;
    this.categories = value.categories;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      location: this.location,
      links: this.links,
      categories: this.categories,
    };
  }
}

// Joi schema for category validation
const categorySchema = joi.object({
  id: joi.number().required(),
  title: joi.string().required(),
  location: joi.string().valid("dropdown-left", "dropdown-down").required(),
  links: joi.array().items(
    joi.object({
      id: joi.number().required(),
      title: joi.string().required(),
      url: joi.string().required(),
    }),
  ),
  categories: joi.array().items(joi.object({ Category })),
});

export default Category;
