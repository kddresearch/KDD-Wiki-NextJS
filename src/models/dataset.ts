import Joi from "joi";


enum DatasetType {
  Image = "image",
  Text = "text",
  Audio = "audio",
  Video = "video",
  Tabular = "tabular",
  TimeSeries = "time_series",
  Geospatial = "geospatial",
  Graph = "graph",
  Other = "other",
}

const datasetSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    is_confidential: Joi.boolean().required(),
    link: Joi.string().required(),
    accessed: Joi.date().required(),
    type: Joi.string().valid(...Object.values(DatasetType)).required(),
    date_created: Joi.date().required(),
    date_modified: Joi.date().required(),
});

class Dataset {
    id: number;
    name: string;
    description: string;
    is_confidential: boolean;
    link: string;
    accessed: Date;
    type: DatasetType;
    date_created: Date;
    date_modified: Date;

    constructor(data: any) {
        // Validate the data
        const { error, value } = datasetSchema.validate(data);

        // If there is an error, throw an error
        if (error) {
            throw new Error(`Dataset validation error: ${error.message}`);
        }

        this.id = value.id;
        this.name = value.name;
        this.description = value.description;
        this.is_confidential = value.is_confidential;
        this.link = value.link;
        this.accessed = value.accessed;
        this.type = value.type;
        this.date_created = value.date_created;
        this.date_modified = value.date_modified;
    }
}

export { Dataset, DatasetType };