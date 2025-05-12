// public/js/like.js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.preventDefault();
        const photoId     = btn.dataset.photoid;
        const currentlyLiked = btn.dataset.liked === 'true';
  
        try {
          const res = await fetch(`/photos/${photoId}/like`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ liked: !currentlyLiked })
          });
          if (!res.ok) throw new Error(await res.text());
  
          const { likes } = await res.json();
          btn.dataset.liked = (!currentlyLiked).toString();
          const icon = btn.querySelector('i.bi');
          icon.classList.toggle('bi-heart-fill', !currentlyLiked);
          icon.classList.toggle('bi-heart',      currentlyLiked);
          btn.querySelector('.like-count').textContent = likes;
        } catch (err) {
          console.error('Like API error:', err);
        }
      });
    });
  });
  