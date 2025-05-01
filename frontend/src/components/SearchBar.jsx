import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { SocialContext } from '../context/context';
import { MagnifyingGlassIcon, XMarkIcon, ArrowPathIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const { baseUrl, token } = useContext(SocialContext);

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Handle search
  const handleSearch = async (query) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/user/search?query=${query}`);
      setSearchResults(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = debounce(handleSearch, 300);

  // Handle input change
  const handleChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Clear input
  const clearInput = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-xl" ref={searchRef}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Search people..."
          value={searchQuery}
          onChange={handleChange}
          onFocus={() => setShowResults(true)}
          className="w-full pl-10 pr-10 py-2.5 bg-gray-800/70 text-gray-100 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all duration-300 shadow-sm"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={clearInput}
            className="absolute inset-y-0 right-3 flex items-center p-1 hover:bg-gray-700/30 rounded-full transition-all duration-300"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-200" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (searchQuery || isLoading) && (
        <div className="absolute mt-2 w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto border border-gray-700">
          {isLoading ? (
            <div className="p-6 text-center text-gray-400">
              <div className="flex justify-center">
                <ArrowPathIcon className="h-6 w-6 animate-spin" />
              </div>
            </div>
          ) : searchResults?.length > 0 ? (
            <ul className="divide-y divide-gray-700">
              {searchResults.map((user) => (
                <li 
                  key={user._id} 
                  className="hover:bg-gray-700/30 transition-all duration-300"
                >
                  <Link
                    to={`/profile/${user._id}`}
                    className="flex items-center p-4 space-x-4"
                    onClick={() => setShowResults(false)}
                  >
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                      />
                    ) : (
                      <UserCircleIcon className="w-12 h-12 text-gray-400" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-100 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      {user.headline && (
                        <p className="text-sm text-gray-400 truncate mt-1">
                          {user.headline}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;