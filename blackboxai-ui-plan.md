Goal: Make index.html + profile.html UI more human/professional, lighter color composition. Move animation/skeleton to left side and input/details to right side.

Implementation outline:
1) index.html: wrap loginPage and registerPage content in an .auth-shell grid.
   - left: skeleton animation block (id=skeleton preserved)
   - right: form card
2) styles.css: introduce light theme variables and apply to auth pages + profile; fix global body flex to avoid breaking layouts.

3) profile.html: create .profile-layout with sidebar (profile header + stats) on left and .profile-content on right.
4) styles.css: style sidebar/content cards, buttons, modals, responsive breakpoints.

Constraints: Do not rename/remove ids/classes referenced in script.js and profile.js.

