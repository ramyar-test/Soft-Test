import { defineStore } from 'pinia';
import axios from '../axios';

export const useBlogStore = defineStore('blog', {
    state: () => ({
        blogs: [],
        authors: [],
        loading: false,
        totalRows: 0,
        errors: [],
    }),
    actions: {
        async fetchBlogs() {
            this.loading = true;
            try {
                const response = await axios.get('/blogs');
                this.blogs = response.data.data;
                this.totalRows = this.blogs.length || 0;
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                this.loading = false;
            }
        },
        async createBlog(blog) {
            try {
                const response = await axios.post('/blogs', blog);
                const lastBlog = this.blogs[0].id;
                this.blogs = [
                    {
                        id: lastBlog + 1,
                        title: blog.title,
                        content: blog.content,
                        author: this.authors.find(author => author.id === blog.author_id).name,
                        status: blog.status,
                    },
                    ...this.blogs,
                ];
                this.errors = [];
            } catch (error) {
                console.error('Error creating blog', error);
                this.errors = error.response.data?.errors;
            }
        },
        async updateBlog(blog) {
            try {
                const response = await axios.put(`/blogs/${blog.id}`, blog);
                const index = this.blogs.findIndex(b => b.id === blog.id);
                if (index !== -1) {
                    this.blogs[index] = {
                        id: blog.id,
                        title: blog.title,
                        content: blog.content,
                        author: this.authors.find(author => author.id === blog.author_id).name,
                        status: blog.status,
                    };
                }
                this.errors = [];
            } catch (error) {
                console.error('Error updating blog', error);
                this.errors = error.response.data?.errors;
            }
        },
        async deleteBlog(blogId) {
            try {
                await axios.delete(`/blogs/${blogId}`);
                this.blogs = this.blogs.filter(blog => blog.id !== blogId);
                this.errors = [];
            } catch (error) {
                console.error('Error deleting blog', error);
                this.errors = error.response.data?.errors;
            }
        },
        async fetchAuthors() {
            try {
                const response = await axios.get('/authors');
                this.authors = response.data.data;
            } catch (error) {
                console.error('Error fetching authors', error);
            }
        },
    },
});