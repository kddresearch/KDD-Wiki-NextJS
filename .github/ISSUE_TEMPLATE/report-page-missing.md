---
name: 'Report Page Missing'
about: Report a missing page on the website
title: 'Missing Page: '
labels: missing content
assignees: Legonois

---

<script>
  const params = new URLSearchParams(window.location.search);
  const missingPage = params.get('missing_page');
  if (missingPage) {
    document.getElementById('missing-page-input').value = missingPage;
  }
</script>

**What page were you expecting to be here?**
<input id="missing-page-input" placeholder="Enter the missing page URL" size="60">

**Additional context**
Add any other context or screenshots about the missing page here.
