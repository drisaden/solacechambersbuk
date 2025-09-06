window.onload = function() {
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
  // Combined author extraction that handles multiple formats
  let authors = 'Unknown Author';
  try {
    // Try both "ABOUT THE AUTHOR" and "Author:" formats
    const aboutAuthorMatch = item.content.match(
      /(?:ABOUT THE AUTHOR(S?)|Author:)\s*([^.]+?)(?:\s*(?:can be reached|is a member|via|\.|<\/p>|$))/i
    );
    
    if (aboutAuthorMatch) {
      const aboutAuthorText = aboutAuthorMatch[2].trim();
      
      const namePattern = /(?:[A-Z][a-z]+\.?\s*)?(?:[A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+)*)(?:\s*(?:,|\band\b|&)\s*(?:[A-Z][a-z]+\.?\s*)?(?:[A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+)*))*/g;
      
      const nameMatches = aboutAuthorText.match(namePattern);
      
      if (nameMatches && nameMatches[0]) {
        authors = nameMatches[0]
          .replace(/\s+/g, ' ') // Collapse multiple spaces
          .replace(/\s*,\s*/g, ', ') // Normalize commas
          .replace(/\s+\band\b\s+/g, ' and ') // Normalize "and"
          .replace(/\s*&\s*/g, ' & ') // Normalize ampersand
          .replace(/\b([A-Z])\.\s*/g, '$1. ') // Normalize initials
          .trim();
      }
    }
  } catch (e) {
    console.error('Error extracting author:', e);
    authors = 'Unknown Author'; // Fallback value
  }
  
  return `
      <div data-aos=" " class="bg-gray-100 shadow-lg rounded-lg mb-1 aos-init aos-animate md:text-base">
        <div class="overflow-hidden rounded-t">
          <img src="${src}" alt="${item.title}" class="w-full  object-cover object-center border border-b-0">
        </div>
        <div class="text-center pt-6">
          <h2 class="text-base md:text-base pt-5 my-8 font-bold tracking-tight ">${item.title}</h2> 
          <author class="text-gray-600 mb-4 text-xs md:text-sm">
            <span class="font-bold">Author:</span> ${authors}
          </author>
          <p class="px-5 text-sm mb-5 md:text-base tracking-tight">
            ${item.content.replace(/<[^>]+>/g, '').split(' ').slice(0, 30).join(' ')} ...
          </p>
          <a href="http://solacechambersbuk.com.ng/single.html?id=${item.id}" target="_blank" class="px-5">
            <p class="text-sm button md:text-base text-blue-700 mb-2 px-5 font-semibold uppercase">Read More »</p>
          </a>
          <hr>
          <p class="text-sm md:text-base font-semibold my-6 text-gray-600">
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