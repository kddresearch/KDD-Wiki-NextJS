import { query } from "../db"; // Assuming you have a query function set up for PostgreSQL interactions
import { MenuItem } from "../models/menu_item";


async function insertMenuItem(menuItem: MenuItem): Promise<void> {
    const query_str = `
        INSERT INTO menu_item (parent_id, child_id, parent_type, child_type)
        VALUES ($1, $2, $3, $4);
    `;
    try {
        await query(query_str, [menuItem.parent_id, menuItem.child_id, menuItem.parent_type, menuItem.child_type]);
        console.log("Menu item inserted successfully");
    } catch (err) {
        console.error("Error occurred during menu item insertion:", err);
        throw err;
    }
}

/**
 * Update an existing menu item
 */
async function updateMenuItem(id: number, menuItem: Partial<MenuItem>): Promise<void> {
    const setClauses: string[] = [];
    const values: (number | string)[] = [id];
    let valueIndex = 2;
  
    for (const [key, value] of Object.entries(menuItem)) {
      if (value !== undefined) {
        setClauses.push(`${key} = $${valueIndex}`);
        values.push(value as number | string); // Type assertion to handle both number and string
        valueIndex++;
      }
    }
  
    if (setClauses.length === 0) {
      throw new Error("No fields to update");
    }
  
    const query_str = `
          UPDATE menu_item
          SET ${setClauses.join(', ')}
          WHERE id = $1;
      `;
  
    try {
      await query(query_str, values);
      console.log("Menu item updated successfully");
    } catch (err) {
      console.error("Error occurred during menu item update:", err);
      throw err;
    }
  }

async function deleteMenuItem(id: number): Promise<void> {
    const query_str = `
        DELETE FROM menu_item
        WHERE id = $1;
    `;

    try {
        await query(query_str, [id]);
        console.log("Menu item deleted successfully");
    } catch (err) {
        console.error("Error occurred during menu item deletion:", err);
        throw err;
    }
}

export { insertMenuItem, updateMenuItem, deleteMenuItem };
