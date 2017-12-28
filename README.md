# jsfiddle

```html
<!DOCTYPE html>
<html>

<head>
   <title>QGRID Plunker</title>

   <!-- Load common libraries -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/typescript/2.1.6/typescript.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/core-js/2.4.1/core.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/zone.js/0.7.2/zone.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/0.19.47/system.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/web-animations/2.2.2/web-animations.min.js"></script>

   <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
   <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,700">

   <!-- Configure SystemJS -->
   <script src="systemjs.config.js"></script>

   <script>
      System
         .import('main.ts')
         .catch(console.error.bind(console));
   </script>

</head>

<body class="mat-app-background">
   <my-app>qgrid example...</my-app>
</body>

</html>
```
