// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 表单提交处理
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        // 这里可以添加实际的表单提交逻辑
        console.log('表单数据:', formData);
        
        // 显示成功消息
        alert('感谢您的留言！我们会尽快与您联系。');
        
        // 重置表单
        contactForm.reset();
    });
}

// 套餐卡片点击事件
document.querySelectorAll('.btn-package, .btn-advanced').forEach(button => {
    button.addEventListener('click', function() {
        const packageCard = this.closest('.package-card, .advanced-card');
        const packageName = packageCard.querySelector('h4').textContent;
        
        // 这里可以添加跳转到详情页或打开模态框的逻辑
        console.log('查看套餐:', packageName);
        
        // 示例：显示提示
        alert(`您正在查看：${packageName}\n\n请联系我们获取更多详情。`);
    });
});

// 导航栏滚动效果
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// 页面加载动画
window.addEventListener('load', function() {
    const cards = document.querySelectorAll('.package-card, .advanced-card, .principle-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// 移动端菜单切换（如果需要）
const navMenu = document.querySelector('.nav-menu');
if (window.innerWidth <= 768) {
    // 可以添加移动端菜单切换逻辑
}


