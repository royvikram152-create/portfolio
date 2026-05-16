# Vikram Chennamsetty — Portfolio

Personal portfolio website for a final-year ECE student.
Single-file, zero dependencies, deploy-ready.

---

## Folder Structure

```
portfolio/
├── index.html          ← entire site (HTML + CSS + JS)
└── Vikram_Chennamsetty_Resume.pdf   ← add your resume PDF here
```

---

## Resume PDF

Place your resume PDF in the same folder as `index.html`
and name it exactly:

```
Vikram_Chennamsetty_Resume.pdf
```

The "Download PDF" button links to this file automatically.

---

## Deploy on GitHub Pages (free)

1. Create a new GitHub repository (e.g. `vikram-portfolio`)
2. Upload `index.html` and `Vikram_Chennamsetty_Resume.pdf`
3. Go to **Settings → Pages**
4. Set Source: **Deploy from a branch → main → / (root)**
5. Click **Save**
6. Your site will be live at:
   `https://CHENNAMSETTYVIKRAM.github.io/vikram-portfolio/`

---

## Deploy on Vercel (free, recommended)

Option A — via Vercel CLI:
```bash
npm i -g vercel
cd portfolio/
vercel
```
Follow the prompts. Done in ~30 seconds.

Option B — via Vercel Dashboard:
1. Push the folder to a GitHub repo
2. Go to https://vercel.com/new
3. Import the repo
4. Click **Deploy** (no build settings needed for static HTML)
5. Your site is live instantly with a `.vercel.app` URL

---

## Customisation Checklist

- [ ] Replace `+91 9347636338` with your current number if changed
- [ ] Confirm all three GitHub repo links are live and public
- [ ] Add your LinkedIn URL if it has changed
- [ ] Place your resume PDF in the folder (see above)
- [ ] Update CGPA if it changes after 6th semester results
- [ ] Update the footer year if needed

---

## Technical notes

- Zero external JS dependencies
- One Google Fonts request (DM Mono + Syne + DM Sans)
- Mobile responsive via CSS Grid + clamp()
- Scroll animations via IntersectionObserver API
- Compatible with all modern browsers
