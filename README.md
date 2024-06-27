# Image Capture Web Component

A custom web component that allows users to easily integrate image capture features into their web applications. The component provides a preview section, a capture button, the ability to switch between different camera devices, and displays thumbnails of captured images with options to delete or download them.

## Installation

1. Clone the repository or download the files.

2. Include the `image-capture.js` script in your HTML file.

    ```html
    <script src="image-capture.js" defer></script>
    ```

## Usage

Add the `<image-capture>` custom element to your HTML.

```html
<image-capture></image-capture>
<div class="thumbnails" id="thumbnails"></div>
<script>
    const imageCaptureElement = document.querySelector('image-capture');
    const thumbnailsContainer = document.getElementById('thumbnails');

    function createThumbnail(imageDataUrl) {
        const thumbnail = document.createElement('div');
        thumbnail.classList.add('thumbnail');
        thumbnail.innerHTML = `
            <img src="${imageDataUrl}">
            <button class="delete-btn">Delete</button>
            <button class="download-btn">Download</button>
        `;
        thumbnailsContainer.appendChild(thumbnail);

        thumbnail.querySelector('.delete-btn').addEventListener('click', () => {
            thumbnailsContainer.removeChild(thumbnail);
        });

        thumbnail.querySelector('.download-btn').addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = imageDataUrl;
            link.download = 'captured-image.png';
            link.click();
        });
    }

    imageCaptureElement.addEventListener('imagecaptured', (event) => {
        const { imageDataUrl } = event.detail;
        createThumbnail(imageDataUrl);
    });
</script>
```

## Customization

You can customize the appearance of the component using CSS variables. Here are the available variables and their default values:

```css

image-capture {
    --preview-width: 100%;
    --preview-height: 300px;
    --button-background: #008CBA;
    --button-color: white;
    --button-padding: 10px 20px;
    --button-border: none;
    --button-border-radius: 5px;
    --button-font-size: 16px;
}

```

Here's an example of customiztion:

```css
/* custom-styles.css */

image-capture {
    --preview-width: 80%;
    --preview-height: 400px;
    --button-background: #4CAF50;
    --button-color: white;
    --button-padding: 15px 30px;
    --button-border: none;
    --button-border-radius: 8px;
    --button-font-size: 18px;
}

```

## Example

Here is a full example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Capture Component</title>
    <script src="image-capture.js" defer></script>
    <style>
        .thumbnails {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .thumbnail {
            position: relative;
            display: inline-block;
        }
        .thumbnail img {
            max-width: 100px;
            max-height: 100px;
        }
        .thumbnail .delete-btn,
        .thumbnail .download-btn {
            position: absolute;
            top: 5px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            padding: 5px;
            font-size: 12px;
        }
        .thumbnail .delete-btn {
            right: 5px;
        }
        .thumbnail .download-btn {
            left: 5px;
        }
    </style>
</head>
<body>
    <image-capture></image-capture>
    <div class="thumbnails" id="thumbnails"></div>
    <script>
        const imageCaptureElement = document.querySelector('image-capture');
        const thumbnailsContainer = document.getElementById('thumbnails');

        function createThumbnail(imageDataUrl) {
            const thumbnail = document.createElement('div');
            thumbnail.classList.add('thumbnail');
            thumbnail.innerHTML = `
                <img src="${imageDataUrl}">
                <button class="delete-btn">Delete</button>
                <button class="download-btn">Download</button>
            `;
            thumbnailsContainer.appendChild(thumbnail);

            thumbnail.querySelector('.delete-btn').addEventListener('click', () => {
                thumbnailsContainer.removeChild(thumbnail);
            });

            thumbnail.querySelector('.download-btn').addEventListener('click', () => {
                const link = document.createElement('a');
                link.href = imageDataUrl;
                link.download = 'captured-image.png';
                link.click();
            });
        }

        imageCaptureElement.addEventListener('imagecaptured', (event) => {
            const { imageDataUrl } = event.detail;
            createThumbnail(imageDataUrl);
        });
    </script>
</body>
</html>
```

## License

This project is licensed under the MIT License.