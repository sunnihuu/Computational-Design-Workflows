// Common utilities and functionality shared across all pages
class CommonUtils {
    constructor() {
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadRobotoFont();
            this.setupNavigation();
        });
    }
    
    // Font loading utility
    async loadRobotoFont() {
        try {
            await document.fonts.ready;
            
            if (document.fonts.check('400 32px Roboto')) {
                console.log('Roboto font is ready');
                return;
            }
            
            const font = new FontFace('Roboto', 'url(https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2)');
            await font.load();
            document.fonts.add(font);
            console.log('Roboto font loaded successfully');
        } catch (error) {
            console.log('Roboto font loaded from fallback');
        }
    }
    
    // Navigation setup
    setupNavigation() {
        const hamburger = document.getElementById('hamburger-menu');
        const burgerMenu = document.getElementById('burger-menu-dropdown');
        
        if (hamburger && burgerMenu) {
            // Hamburger click handler
            hamburger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isOpen = burgerMenu.style.display === 'none' || !burgerMenu.classList.contains('open');
                
                burgerMenu.style.display = 'block';
                setTimeout(() => {
                    burgerMenu.classList.toggle('open', isOpen);
                    hamburger.classList.toggle('open', isOpen);
                }, 10);
            });
            
            // Hide menu when clicking outside
            document.addEventListener('click', (e) => {
                if (burgerMenu.classList.contains('open') && !burgerMenu.contains(e.target) && e.target !== hamburger) {
                    const openSub = burgerMenu.querySelector('.has-submenu.open');
                    if (openSub) openSub.classList.remove('open');
                    burgerMenu.classList.remove('open');
                    hamburger.classList.remove('open');
                    setTimeout(() => {
                        burgerMenu.style.display = 'none';
                    }, 350);
                }
            });
            
            // Submenu toggle logic
            const spatialCanvases = burgerMenu.querySelector('.has-submenu > a');
            if (spatialCanvases) {
                spatialCanvases.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const parentLi = spatialCanvases.parentElement;
                    burgerMenu.querySelectorAll('.has-submenu.open').forEach(li => {
                        if (li !== parentLi) li.classList.remove('open');
                    });
                    parentLi.classList.toggle('open');
                });
            }
            
            // Close submenu when clicking another main menu item
            burgerMenu.querySelectorAll('.menu-page').forEach(link => {
                if (!link.closest('.has-submenu')) {
                    link.addEventListener('click', () => {
                        const openSub = burgerMenu.querySelector('.has-submenu.open');
                        if (openSub) openSub.classList.remove('open');
                    });
                }
            });
        }
    }
}

// Canvas utilities shared between 2D and 3D pages
class CanvasUtils {
    // Text card management
    static toggleTextCard(cardId, show) {
        const textCard = document.getElementById(cardId);
        if (textCard) {
            textCard.style.display = show ? 'block' : 'none';
        }
    }

    // Key handling
    static createKeyHandler(keys) {
        return {
            handleKeyDown: (event) => {
                switch(event.key) {
                    case 'ArrowUp':
                    case 'w':
                    case 'W':
                        keys.up = true;
                        event.preventDefault();
                        break;
                    case 'ArrowDown':
                    case 's':
                    case 'S':
                        keys.down = true;
                        event.preventDefault();
                        break;
                    case 'ArrowLeft':
                    case 'a':
                    case 'A':
                        keys.left = true;
                        event.preventDefault();
                        break;
                    case 'ArrowRight':
                    case 'd':
                    case 'D':
                        keys.right = true;
                        event.preventDefault();
                        break;
                }
            },
            handleKeyUp: (event) => {
                switch(event.key) {
                    case 'ArrowUp':
                    case 'w':
                    case 'W':
                        keys.up = false;
                        break;
                    case 'ArrowDown':
                    case 's':
                    case 'S':
                        keys.down = false;
                        break;
                    case 'ArrowLeft':
                    case 'a':
                    case 'A':
                        keys.left = false;
                        break;
                    case 'ArrowRight':
                    case 'd':
                    case 'D':
                        keys.right = false;
                        break;
                }
            }
        };
    }

    // Truchet tiles drawing
    static drawTruchetTiles(ctx, width, height, time = 0, tileSize = 40) {
        const cols = Math.ceil(width / tileSize);
        const rows = Math.ceil(height / tileSize);
        
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, width, height);
        
        for (let row = 0; row <= rows; row++) {
            for (let col = 0; col <= cols; col++) {
                const x = col * tileSize;
                const y = row * tileSize;
                
                const tileType = Math.floor(Math.sin(time * 0.5 + row * 0.3 + col * 0.2) * 4) % 4;
                const rotation = Math.floor(Math.sin(time * 0.3 + row * 0.4 + col * 0.1) * 4) % 4;
                
                ctx.save();
                ctx.translate(x + tileSize/2, y + tileSize/2);
                ctx.rotate((rotation * Math.PI) / 2);
                
                ctx.strokeStyle = '#333333';
                ctx.lineWidth = 3;
                ctx.beginPath();
                
                if (tileType === 0) {
                    ctx.arc(-tileSize/2, -tileSize/2, tileSize/2, 0, Math.PI/2);
                    ctx.arc(tileSize/2, tileSize/2, tileSize/2, Math.PI, 3*Math.PI/2);
                } else if (tileType === 1) {
                    ctx.arc(tileSize/2, -tileSize/2, tileSize/2, Math.PI/2, Math.PI);
                    ctx.arc(-tileSize/2, tileSize/2, tileSize/2, 3*Math.PI/2, 2*Math.PI);
                } else if (tileType === 2) {
                    ctx.moveTo(-tileSize/2, 0);
                    ctx.lineTo(tileSize/2, 0);
                    ctx.moveTo(0, -tileSize/2);
                    ctx.lineTo(0, tileSize/2);
                } else {
                    ctx.moveTo(-tileSize/2, -tileSize/2);
                    ctx.lineTo(tileSize/2, tileSize/2);
                    ctx.moveTo(-tileSize/2, tileSize/2);
                    ctx.lineTo(tileSize/2, -tileSize/2);
                }
                
                ctx.stroke();
                ctx.restore();
            }
        }
    }

    // Score display
    static drawScore(ctx, score, canvasWidth, x = null, y = 38) {
        const text = `Score: ${score}`;
        const textX = x || canvasWidth - 20;
        
        ctx.font = '400 24px Roboto, sans-serif';
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = 30;
        const padding = 20;
        
        const bgWidth = textWidth + padding;
        const bgHeight = textHeight;
        const bgX = textX - bgWidth;
        const bgY = y - textHeight + 5;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
        
        ctx.fillStyle = '#a200ff';
        ctx.font = '400 24px Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(text, bgX + bgWidth/2, y);
    }

    // Congratulations text
    static drawCongratulations(ctx, canvasWidth, canvasHeight) {
        const text = "Congratulations!";
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        
        if (document.fonts.check('400 32px Roboto')) {
            ctx.fillStyle = '#a200ff';
            ctx.font = '400 32px Roboto, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, centerX, centerY);
        } else {
            ctx.fillStyle = '#a200ff';
            ctx.font = '400 32px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, centerX, centerY);
        }
    }
}

// Initialize common functionality
new CommonUtils(); 