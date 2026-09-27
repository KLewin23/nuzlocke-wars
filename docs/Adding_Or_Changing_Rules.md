# How to add or change the homepage rules content

### Please read the entire file as some segments have been pulled out to reduce duplication

This is a guide to add new rules and rule segments to the website homepage

## Modifying the rules
1. Navigate to `./src/data/rules.ts`

#### To add a ruleset
2. Copy one of the existing segments which contains the `title`, `colour`, `rules`, `image`,
    ```ts
        {
            title: 'General Rules',
            colour: RuleSegmentColour.Red,
            rules: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
            ],
            image: Muk,
        }
    ```
3. Paste it below the existing other rule sections in that file. (Order matters)
4. Change the any of the values you want to change, if you need to add an image [read this](#how-to-add-images-to-the-rules-data-file) 

#### To add or remove a rule
2. Find the target ruleset you want to edit
3. Find the specific rule you want to edit in that ruleset
4. Change the text within the '{{TEXT}}' marks or even delete the rule (if there are none left the ruleset should really go). If you add an apostrophe put a `\` BACKSLASH before it (escapies the character) else it  will think you are ending the string on that apostrophe

#### To change a ruleset
2. Find the target ruleset you want to edit
3. Modify the `title`, `colour`, [rules](#to-add-or-remove-a-rule), [image](#how-to-add-images-to-the-rules-data-file)


## How to add images to the rules data file. 
1. Copy your preferably square image into `./public` we accept most standard types
2. Add the import statement to the top of the `./src/data/rules.ts` file e.g. 
    ```ts 
        import MyImage from '@public/MySpecialImage.png';
    ```
    The name of the import before the `from` does not have to match the file name, but it must be unique in the `rules.ts` file. The `@public` just means in the `./public` folder.
3. Use the import name `MyImage` in the above in as the value for the image property in a rule segment

## Colours
Currently we only accepte four colours
- Red
- Orange
- Yellow
- Green

If we need more let @KLewin23 know