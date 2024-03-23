import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import { Component } from 'react';

import profile1 from '../../assets/images/profile1.jpg';
import profile2 from '../../assets/images/profile2.jpg';
import profile3 from '../../assets/images/profile3.jpg';

class Reviews extends Component {
    render () {
        return (
            <Swiper pagination={true} modules={[Pagination, Autoplay]} className="mySwiper" slidesPerView={1} loop={true} autoplay={{ delay: 2500, disableOnInteraction: true }}>
                <SwiperSlide>
                    <div className="review bg-gray-800 text-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center space-x-4">
                            <img className="w-12 h-12 rounded-full" src={profile3} alt="Emma" />
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Emma Johnson</h3>
                                <div className="flex">
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                </div>
                            </div>
                        </div>
                        <p className="mt-3 text-sm">I've been using this site for my business meetings, and it's incredibly efficient and user-friendly. A must-have tool for professionals!</p>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="review bg-gray-800 text-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center space-x-4">
                            <img className="w-12 h-12 rounded-full" src={profile1} alt="John" />
                            <div>
                                <h3 className="text-lg font-semibold mb-1">John Doe</h3>
                                <div className="flex">
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>

                                </div>
                            </div>
                        </div>
                        <p className="mt-3 text-sm">This is the best scheduling tool I've encountered. It's streamlined my appointments and made coordination a breeze!</p>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="review bg-gray-800 text-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center space-x-4">
                            <img className="w-12 h-12 rounded-full" src={profile2} alt="Sarah" />
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Sarah Lee</h3>
                                <div className="flex">
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                </div>
                            </div>
                        </div>
                        <p className="mt-3 text-sm">Incredible! This website has simplified my life. The interface is intuitive and makes scheduling hassle-free.</p>
                    </div>
                </SwiperSlide>
            </Swiper>
        );
    }
}

export default Reviews;