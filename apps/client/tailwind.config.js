/** @type {import('tailwindcss').Config} */
module.exports = {
    presets: [require("@spartan-ng/ui-core/hlm-tailwind-preset")],
    content: ["./src/**/*.{html,ts}", "./ui/**/*.{html,ts}"],
    theme: {
        extend: {
            spacing: {
                120: "30rem",
                128: "32rem",
                160: "40rem",
                192: "48rem",
            },
        },
    },
    plugins: [],
};
