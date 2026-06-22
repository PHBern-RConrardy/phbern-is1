#show: doc => phbern(
$if(title)$
  title: "$title$",
$endif$
$if(subtitle)$
  subtitle: "$subtitle$",
$endif$
$if(author)$
  author: "$author$",
$endif$
  body: doc,
)