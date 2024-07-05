const plugin = require('tailwindcss/plugin');

const underlineStrikethroughUtility = plugin(function({ addUtilities, e }) {
    const newUtilities = {
        '.underline-strikethrough': {
        'text-decoration': 'underline line-through',
        },
    };
    addUtilities(newUtilities, ['responsive', 'hover']);
});

module.exports = underlineStrikethroughUtility;