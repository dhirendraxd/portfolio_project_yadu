
import type { Config } from "tailwindcss";
// new changes commiting to new 

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				inter: ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				// Extended professional color palette
				navy: {
					DEFAULT: 'hsl(var(--navy))',
					foreground: 'hsl(var(--navy-foreground))'
				},
				clay: {
					DEFAULT: 'hsl(var(--clay))',
					foreground: 'hsl(var(--clay-foreground))'
				},
				cream: {
					DEFAULT: 'hsl(var(--cream))',
					foreground: 'hsl(var(--cream-foreground))'
				},
				charcoal: {
					DEFAULT: 'hsl(var(--charcoal))',
					foreground: 'hsl(var(--charcoal-foreground))'
				},
				coral: {
					DEFAULT: 'hsl(var(--coral))',
					foreground: 'hsl(var(--coral-foreground))'
				},
				sage: {
					DEFAULT: 'hsl(var(--sage))',
					foreground: 'hsl(var(--sage-foreground))'
				},
				// New earthy colors
				forest: {
					DEFAULT: 'hsl(var(--forest))',
					foreground: 'hsl(var(--forest-foreground))'
				},
				earth: {
					DEFAULT: 'hsl(var(--earth))',
					foreground: 'hsl(var(--earth-foreground))'
				},
				// New gradient theme colors
				'earth-brown': {
					DEFAULT: 'hsl(var(--earth-brown))',
					foreground: 'hsl(var(--earth-brown-foreground))'
				},
				'sunlight-yellow': {
					DEFAULT: 'hsl(var(--sunlight-yellow))',
					foreground: 'hsl(var(--sunlight-yellow-foreground))'
				},
				'deep-purple': {
					DEFAULT: 'hsl(var(--deep-purple))',
					foreground: 'hsl(var(--deep-purple-foreground))'
				},
				'soft-pink': {
					DEFAULT: 'hsl(var(--soft-pink))',
					foreground: 'hsl(var(--soft-pink-foreground))'
				},
				// Glass colors
				'glass-border': 'var(--glass-border)',
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'4xl': '2rem'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'gentle-float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'fade-in-up': {
					from: {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-right': {
					from: {
						opacity: '0',
						transform: 'translateX(30px)'
					},
					to: {
						opacity: '1',
						transform: 'translateX(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'gentle-float': 'gentle-float 6s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 1s ease-out forwards',
				'slide-in-right': 'slide-in-right 0.6s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
	hint: { 
		enabled: true,
		content: "This is a hint"
		
	} satisfies Config;
