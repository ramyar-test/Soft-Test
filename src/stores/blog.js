import { defineStore } from 'pinia';
import axios from '../axios';

export const useBlogStore = defineStore('blog', {
    state: () => ({
        blogs: [],
        loading: false,
        totalRows: 0,
    }),
    actions: {
        async fetchBlogs() {
            this.loading = true;
            try {
                const response = await axios.get('/blogs');
                const data = response.data.data;
                this.blogs = Array.isArray(data) ? data : [];
                this.totalRows = data.length || 0;
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                this.loading = false;
            }
        },
        async createBlog(blog) {
            try {
                const response = await axios.post('/blogs', blog);
                this.blogs.push(response.data.data);
            } catch (error) {
                console.error('Error creating blog', error);
            }
        },
        async updateBlog(blog) {
            try {
                const response = await axios.put(`/blogs/${blog.id}`, blog);
                const index = this.blogs.findIndex(b => b.id === blog.id);
                if (index !== -1) {
                    this.blogs[index] = response.data.data;
                }
            } catch (error) {
                console.error('Error updating blog', error);
            }
        },
        async deleteBlog(blogId) {
            try {
                await axios.delete(`/blogs/${blogId}`);
                this.blogs = this.blogs.filter(blog => blog.id !== blogId);
            } catch (error) {
                console.error('Error deleting blog', error);
            }
        },
    },
});