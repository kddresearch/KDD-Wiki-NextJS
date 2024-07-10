import Joi from "joi";
import NavItem from "./nav_item";

// Joi schema for category validation
const categorySchema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().required(),
  location: Joi.string().valid("dropdown-left", "dropdown-down").required(),
  links: Joi.array().items(
    Joi.object({
      id: Joi.number().required(),
      title: Joi.string().required(),
      url: Joi.string().required(),
    })
  ).required(),
  categories: Joi.array().items(Joi.object().unknown(true)).required(),
});

class Category {
  id: number;
  title: string;
  location: string;
  links: NavItem[];
  categories: Category[];

  constructor(data: any) {
    const { error, value } = categorySchema.validate(data);
    if (error) {
      throw new Error(`Category validation error: ${error.message}`);
    }
    this.id = value.id;
    this.title = value.title;
    this.location = value.location;
    this.links = value.links;
    this.categories = value.categories.map((category: any) => new Category(category));
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

export default Category;
