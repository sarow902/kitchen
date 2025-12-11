document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', function() {
                window.localStorage.setItem("updated" , "false");
            });
            serviceWorkerRegistration();
        }

        class pageElements{
            constructor(){
                this.whatsAppLink = "https://wa.me/201064459117/";
                this.instaLink = "https://www.instagram.com/grn.nergy/";
                this.faceBookLink = "https://www.facebook.com/61579738025999/";
                this.shareSiteData = {
                    title: "Sara's Healthy Meals Kitchen",
                    text: "Check out this amazing Healthy Kitchen Meals web app!",
                    url: "https://sarakitchen.netlify.app/"
                };
                this.updated = window.localStorage.getItem("updated");
                this.language = (window.localStorage.getItem("language") || "en");
                this.root = document.querySelector(":root");
                this.gradientStart = window.getComputedStyle(this.root).getPropertyValue("--gradientStart");
                this.gradientEnd = window.getComputedStyle(this.root).getPropertyValue("--gradientEnd");
                this.clickSound = document.getElementById("clickSound");
                this.languageToggle = document.getElementById("languageToggle");
                this.langCheckbox = document.getElementById("langCheckbox");
                this.fullscreenToggle = document.getElementById("fullscreenToggle");
                this.refreshButton = document.getElementById("refreshButton");
                this.itemsContainer = document.getElementById("items");
                this.itemDiv = document.getElementsByClassName("item")[0];
                this.title = document.getElementById("title");
                this.subtitle = document.getElementById("subtitle");
                this.logo = document.getElementById("logo");
                this.startButton = document.getElementById("startButton");
                this.shareButton = document.getElementById("shareButton");
                this.installButton = document.getElementById("installButton");
                this.canvas = document.getElementById('firefliesCanvas');
                this.socials = document.getElementById('socials');
                this.fbButton = document.getElementById('fbButton');
                this.instaButton = document.getElementById('instaButton');
                this.wappButton = document.getElementById('wappButton');
                this.tray = document.getElementById("tray");

            }
        }

        var p = new pageElements();

        switch(p.language)
        {
            case "ar":
                p.langCheckbox.checked = true;
                break;

            case "en":
                p.langCheckbox.checked = false;
                break;
        }
        setLanguage(p.language);
        p.langCheckbox.addEventListener('change', () => {
            if (p.langCheckbox.checked) setLanguage("ar");
            else setLanguage("en");
        });
        
        p.fullscreenToggle.addEventListener('click', () => {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen();
            else  document.exitFullscreen();
        });
        
        p.refreshButton.addEventListener('click', () => {
            window.localStorage.setItem("updated" , "true");
            window.location.reload();
        });

        document.addEventListener('keydown', function(event) {
            if (event.code === 'F5') window.localStorage.setItem("updated" , "true");
        });

        if (p.updated !== "true") window.alert('New content available! Please refresh the page!');

        p.wappButton.addEventListener('click', () => {
            var url = p.whatsAppLink+"?text="+encodeURIComponent("Hello, I would like to know more about our healthy meals");
            window.open(url, '_blank');
        });

        p.instaButton.addEventListener('click', () => {
            window.open(p.instaLink, '_blank');
        });

        p.fbButton.addEventListener('click', () => {
            window.open(p.faceBookLink, '_blank');
        });

        document.addEventListener("mouseup", (event) => {
            if (event.button !== 0) return;

            var x = event.clientX;
            var y = event.clientY;
            var elementUnderMouse = document.elementFromPoint(x, y);

            switch(elementUnderMouse.tagName.toLowerCase()) {
                case 'button':
                case 'path':
                case 'span':
                case 'svg':
                    p.clickSound.currentTime = 0;
                    p.clickSound.play();
                    break;
            }
        });
        
        p.shareButton.addEventListener('click', async () => {
            if (!navigator.share) {
                window.alert("Sharing not supported on this browser. Please copy the URL from the address bar.");
                return;
            }
            try { await navigator.share(p.shareSiteData); }
            catch (err) {
                console.log(`Error: ${err}`);
                window.alert("Sharing failed! It could be your browser.");
            }
        });

        var deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            p.installButton.style.display = 'block';
        });

        p.installButton.addEventListener('click', async () => {
            deferredPrompt.prompt();
            const result = await deferredPrompt.userChoice;
            console.log(`Install prompt was: ${result.outcome}`);
            deferredPrompt = null;
            p.installButton.style.display = 'none';
        });
        
        p.startButton.addEventListener('click', async () => {
            p.title.style.visibility = "hidden";
            p.subtitle.style.visibility = "hidden";
            p.logo.style.visibility = "hidden";
            p.startButton.style.visibility = "hidden";
            p.shareButton.classList.remove("shareButton");
            p.shareButton.classList.add("subIcon");
            p.installButton.classList.remove("installButton");
            p.installButton.classList.add("subIcon");
            p.tray.appendChild(p.shareButton);
            p.tray.appendChild(p.installButton);
            p.tray.style.visibility = "visible";
            p.itemsContainer.style.display = "inline-flex";
            document.body.style.backgroundImage = "none";
        });

        pageLoadEffects(p);
        populateProducts(p);
    }
};

function pageLoadEffects(p) {

    p.title.animate(
        { transform: 'translate(-50%, calc(-50dvh + 20%))' },
        { duration: 1000, fill: 'forwards' }
    );
    setTimeout( () => { p.title.style.fontSize = "1.5rem"; }, 1000);

    p.subtitle.animate(
        { transform: 'translate(-50%, calc(-50dvh + 100%))' },
        { duration: 1000, fill: 'forwards' }
    );
    setTimeout( () => { p.subtitle.style.fontSize = "1.25rem"; }, 1000);

    setTimeout( () => {
        p.logo.style.visibility = "visible";
        p.logo.animate(
            { transform: 'translate(0, calc(-70dvh + 9rem))' },
            { duration: 1000, fill: 'forwards' }
        );
        p.logo.style.transform = "rotateY(180deg)";
    }, 1000);


    setTimeout( () => {
        document.body.style.backgroundImage = `linear-gradient(to bottom, ${p.gradientStart}, ${p.gradientEnd})`;
    }, 2000);

    setTimeout( () => { animateFireflies(); }, 1000);

    setTimeout( () => {
        p.languageToggle.style.visibility = 'visible';
        p.startButton.style.visibility = 'visible';
        p.shareButton.style.visibility = 'visible';
        p.installButton.style.visibility = 'visible';
        p.socials.style.visibility = 'visible';
    }, 2500);

    const ctx = p.canvas.getContext('2d');
    p.canvas.width = window.innerWidth;
    p.canvas.height = window.innerHeight;

    class Firefly {
        constructor() {
            this.x = Math.random() * p.canvas.width;
            this.y = Math.random() * p.canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2;
            this.opacity = Math.random();
            this.fadeSpeed = (Math.random() - 0.5) * 0.01;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity += this.fadeSpeed;

            if (this.opacity > 1 || this.opacity < 0) {
                this.fadeSpeed *= -1;
            }

            // Wrap around screen
            if (this.x > p.canvas.width) this.x = 0;
            if (this.x < 0) this.x = p.canvas.width;
            if (this.y > p.canvas.height) this.y = 0;
            if (this.y < 0) this.y = p.canvas.height;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 150, ${this.opacity})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(255, 255, 150, ${this.opacity})`;
            ctx.fill();
        }
    }

    const fireflies = [];
    const numFireflies = 75;

    for (let i = 0; i < numFireflies; i++) {
        fireflies.push(new Firefly());
    }

    function animateFireflies() {
        ctx.clearRect(0, 0, p.canvas.width, p.canvas.height);
        for (const firefly of fireflies) {
            firefly.update();
            firefly.draw();
        }
        requestAnimationFrame(animateFireflies);
    }
}

async function setLanguage(languageCode, translationFile = "./js/locals.json")
{
    // Skip if there's no need to continue.
    if (!languageCode || languageCode === "") return;
    if (document.documentElement.lang  === languageCode) return;

    const locals = await getData(translationFile);
    if (!locals) return;    // Skip if there's no translation file

    // Store language selection in storage
    window.localStorage.setItem("language", languageCode);

    switch(languageCode)
    {
        case "ar":
            document.documentElement.dir = "rtl";
            break;

        case "en":
            document.documentElement.dir = "ltr";
            break;
    }
    document.documentElement.lang = languageCode;

    // Try direct attribute translation first
    document.querySelectorAll("[en],[ar]").forEach((field) => {
        var translation = field.getAttribute(languageCode);
        if (!translation) return;   // If no translation available, skip to next iteration
        // Apply translation
        field.innerHTML = translation;
    });
    
    document.querySelectorAll("[locKey]").forEach((field) => {
        var key = field.getAttribute("locKey");
        var translation = locals[languageCode][key];
        if (!translation) return;   // If no translation available, skip to next iteration
        
        // Apply translation
        field.innerHTML = translation;
    });

    document.querySelectorAll("[locKeyTitle]").forEach((field) => {
        var key = field.getAttribute("locKeyTitle");
        var translation = locals[languageCode][key];
        if (!translation) return;   // If no translation available, skip to next iteration
        
        // Apply translation
        field.title = translation;
    });


}

/**
 * General purpose function to 'fetch' data from a url.
 * @param {url} url - The link to the needed data.
 */
async function getData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) { throw new Error(`Couldn't fetch resources at: ${url}. Response status: ${response.status}`); }
      var json = await response.json();
      return json;
    }
    catch (error) { window.alert(error.message); }
}

function serviceWorkerRegistration() {
    navigator.serviceWorker.register('./serviceWorker.js', { scope: './' }).then((registration) => {
        if (registration.installing) console.log('Service worker is installing');
    }).catch((error) => {
        console.error('Service worker registration failed:', error);
    });
}

async function populateProducts(p, productsFilePath = "./js/products.json") {
    const productsFile = await getData(productsFilePath);
    if (!productsFile) return;

    const products = productsFile.products;
    if (!products || products.length === 0) return;
    products.forEach((product) => {
        p.itemDiv.style.display = "flex";
        var newItem = p.itemDiv.cloneNode(true);
        var producturl = p.whatsAppLink+"?text="+encodeURIComponent("Hello, I would like to order: "+product.name);
         
        newItem.querySelector(".name").setAttribute("en", product.name);
        newItem.querySelector(".name").setAttribute("ar", product.name_ar);
        newItem.querySelector(".itemImage").src = product.image;
        newItem.querySelector(".cart").addEventListener('click', () => {  window.open(producturl, '_blank'); });
        newItem.querySelector(".nutritions").setAttribute("en", product.nutritions);
        newItem.querySelector(".nutritions").setAttribute("ar", product.nutritions_ar);
        newItem.querySelector(".details").setAttribute("en", product.details);
        newItem.querySelector(".details").setAttribute("ar", product.details_ar);
        p.itemsContainer.appendChild(newItem);
    });

    p.itemDiv.style.display = "none";
    
    document.querySelectorAll("[en],[ar]").forEach((field) => {
        var translation = field.getAttribute(p.language);
        if (!translation) return;   // If no translation available, skip to next iteration
        // Apply translation
        field.innerHTML = translation;
    });


}

