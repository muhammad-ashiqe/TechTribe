import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi'; // Import icons

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

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
      const response = await axios.get(`http://localhost:7000/api/user/search?query=${query}`);
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
    <div className="relative w-full max-w-md mx-4" ref={searchRef}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Search by name or job title..."
          value={searchQuery}
          onChange={handleChange}
          onFocus={() => setShowResults(true)}
          className="block w-full pl-10 pr-10 py-2.5 rounded-xl border-0 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all duration-200 shadow-sm"
        />

        {/* Clear Button (Only shown when there's text) */}
        {searchQuery && (
          <button
            onClick={clearInput}
            className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          >
            <FiX className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (searchQuery || isLoading) && (
        <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="p-4 text-center text-gray-700 dark:text-gray-300">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            </div>
          ) : searchResults?.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {searchResults.map((user) => (
                <li key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Link
                    to={`/profile/${user._id}`}
                    className="flex items-center p-3 space-x-3"
                    onClick={() => setShowResults(false)}
                  >
                    <img
                      src={user.profilePic}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      {user.headline && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.headline}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-700 dark:text-gray-300">
              No matching profiles found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
