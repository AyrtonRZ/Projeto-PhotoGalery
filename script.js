class PhotoGallery{
    constructor(){
        this.API_key='563492ad6f91700001000001cec44e5eb28140b9928c46e762b4a44c'
        this.galleryDiv = document.querySelector('.gallery');
        this.searchForm = document.querySelector('.header form');
        this.logo = document.querySelector('.logo');
        this.loadMore = document.querySelector('.load-more');
        this.pageIndex = 1;
        this.searchValueGlobal = '';
        this.eventHandle();
    }
    eventHandle(){
        document.addEventListener('DOMContentLoaded',()=>{
            this.getImg(1);
        });
        this.searchForm.addEventListener('submit', (e)=>{
            this.pageIndex = 1;
            this.getSearchImages(e);
        });
        this.logo.addEventListener('click', (e)=>{
            this.galleryDiv.innerHTML = '';
            this.getImg(this.pageIndex);
        });
        this.loadMore.addEventListener('click', (e)=>{
            this.loadMoreImages(e);
        })    
    }
    async getImg(index){
        this.loadMore.setAttribute('data-img', 'curated');
        const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=9`;
        const data =  await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos)
        console.log(data)
    }
    async fetchImages(baseURL){
        const response = await fetch(baseURL,{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: this.API_key
            }
        });
        const data = await response.json();
        return data;
    }
    GenerateHTML(photos){
        photos.forEach(photo=>{
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
            <a href='${photo.src.original}' target="blank">
                <img src="${photo.src.medium}">
                <h3>${photo.photographer}</h3>
            </a>
            `;
            this.galleryDiv.appendChild(item);
        })
    }
    
    async getSearchImages(e){
        this.loadMore.setAttribute('data-img', 'search');
        e.preventDefault();
        this.galleryDiv.innerHTML="";
        const searchValue = e.target.querySelector('input').value;
        this.searchValueGlobal = searchValue;
        const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=9`
        const data =  await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos);
        e.target.reset();
    }
    async getMoreSearchImages(index){
        const baseURL = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=9`
        const data =  await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos);

    }
    loadMoreImages(e){
        let index = ++this.pageIndex;
        const loadMoreData =  e.target.getAttribute('data-img');
        if(loadMoreData === 'curated'){
            this.getImg(index)
        }else{
            this.getMoreSearchImages(index);
        }
    }
}
const gallery = new PhotoGallery;
