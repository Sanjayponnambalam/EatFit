
import pandas as pd

# Load the Excel file
file_path = "C:/Users/sanja/OneDrive/Desktop/Career/Projects/EatFit/IndianFoodDatasetXLS.xlsx"   # Update with the actual file path
df = pd.read_excel(file_path)

# Create formatted text
output_path = "C:/Users/sanja/OneDrive/Desktop/Career/Projects/EatFit/IndianFoodLLaMA_dataset.txt"
with open(output_path, "w", encoding="utf-8") as f:
    for _, row in df.iterrows():
        # Handle missing values safely
        ingredients = str(row['TranslatedIngredients']) if pd.notna(row['TranslatedIngredients']) else ""
        diet = str(row['Diet']) if pd.notna(row['Diet']) else ""

        # Extract ingredient names (remove quantities)
        ingredients_list = ", ".join([item.split(" ", 1)[-1] for item in ingredients.split(",") if " " in item])

        # Format system and user prompts
        system_prompt = f"<<SYS>>\nProvide detailed cooking instructions for a dish made with the following ingredients: {ingredients_list}. The dish follows a {diet} diet.\n<</SYS>>"
        user_prompt = f"[INST] {ingredients_list}, {diet} diet [/INST]"

        # Write to file
        f.write(f"<s>{user_prompt}\n{system_prompt}\n{row['TranslatedInstructions']} </s>\n\n")

print(f"Dataset saved to {output_path}")
