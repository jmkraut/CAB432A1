var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const theHtml = `
<html>
<head><title>My First SSR</title></head>
<body>
<h1>My First Server Side Render</h1>
<div id="reactele">{{{reactele}}}</div>
<script src="/app.js" charset="utf-8"></script>
<script src="/vendor.js" charset="utf-8"></script>
</body>
</html>
`;
res.send(theHtml);
});

module.exports = router;
