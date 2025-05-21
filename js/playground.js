window.onload = function () {
    const apiKey = 'AIzaSyAjEyj_94p-HFjFn76t6f-sLNdugSF8LhQ';
    const blogId = '7744757304303679629';
    const baseUrl = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}`;
  
    fetch(baseUrl)
      .then(response => response.json())
      .then(data => {
        if (!data.items) {
          console.error('No items found in data');
          return;
        }
  
        const sections = {
          'All': document.getElementById('populate-All'),
          'News': document.getElementById('populate-News'),
          'Legalbit': document.getElementById('populate-Legalbit'),
          'Poetrylines': document.getElementById('populate-Poetrylines'),
        };
  
        Object.keys(sections).forEach(label => {
            const filtered = label === 'All' ? data.items : data.items.filter(item => item.labels?.some(l => l.toLowerCase() === label.toLowerCase()));
            displayPosts(filtered.slice(0, 4), sections[label]);
            if (label !== 'All') {
              const viewMore = document.createElement('div');
              viewMore.innerHTML = `
                <div class="text-center mt-4">
                  <a href="${label.toLowerCase()}.html" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
                    View More ${label} Posts »
                  </a>
                </div>
              `;
              sections[label].appendChild(viewMore);
            }
          });
          
      })
      .catch(error => console.error('Error fetching data:', error));
  };
  
  function displayPosts(posts, container) {
    container.innerHTML = '';
    posts.forEach(item => {
      const src = item.content.match(/<img[^>]*src="([^"]*)"/)?.[1] || 'https://via.placeholder.com/600x400';
      container.innerHTML += createCard(item, src);
    });
  }
  
  function createCard(item, src) {
    return `
      <div data-aos=" " class="bg-gray-100 shadow-lg w-full rounded-lg mb-1 aos-init aos-animate">
        <div class="md:w-full overflow-hidden rounded-t">
          <img src="${src}" alt="${item.title}" class="w-full h-full object-cover object-center border border-b-0">
        </div>
        <div class="text-center pt-6">
          <h2 class="text-base md:text-3xl pt-5 my-8 font-bold tracking-tight uppercase">${item.title}</h2> 
          <author class="text-gray-600 mb-4 text-xs">
            <span class="font-bold">Author:</span> ${item.content.match(/Written\s+By:\s*([^\.<]+)/i)?.[1].trim() || 'Unknown Author'}
          </author>
          <p class="px-5 text-sm mb-5 md:text-2xl tracking-tight">
            ${item.content.replace(/<[^>]+>/g, '').split(' ').slice(0, 30).join(' ')} ...
          </p>
          <a href="http://drisaden.github.io/solace-buk/single.html?id=${item.id}" target="_blank" class="px-5">
            <p class="text-sm button md:text-2xl text-blue-700 mb-2 px-5 font-semibold uppercase">Read More »</p>
          </a>
          <hr>
          <p class="text-sm md:text-lg font-semibold my-6 text-gray-600">
            <i class="fas fa-calendar pr-1"></i> ${formatDate(item.published.split('T')[0])}
          </p>
        </div>
      </div>
    `;
  }
  
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  