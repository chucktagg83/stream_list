
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from './CartContext';
import { toast } from 'react-toastify';
import { FaCreditCard, FaUser, FaCalendarAlt, FaLock, FaArrowLeft } from 'react-icons/fa';
import './CreditCardForm.css';

const CreditCardForm = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate total
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;
  
  // Load saved card data if available
  useEffect(() => {
    const savedCard = localStorage.getItem('savedCard');
    if (savedCard) {
      try {
        const cardData = JSON.parse(savedCard);
        setCardNumber(cardData.cardNumber || '');
        setCardName(cardData.cardName || '');
        setExpiryDate(cardData.expiryDate || '');
        setSaveCard(true);
      } catch (error) {
        console.error('Error parsing saved card data:', error);
      }
    }
  }, []);
  
  // Format card number with spaces (1234 5678 9012 3456)
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format expiry date (MM/YY)
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    
    return v;
  };
  
  // Handle card number input
  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
    
    // Clear error when user types
    if (errors.cardNumber) {
      setErrors({...errors, cardNumber: null});
    }
  };
  
  // Handle expiry date input
  const handleExpiryDateChange = (e) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setExpiryDate(formattedValue);
    
    // Clear error when user types
    if (errors.expiryDate) {
      setErrors({...errors, expiryDate: null});
    }
  };
  
  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate card number (16 digits with spaces)
    const cardNumberDigits = cardNumber.replace(/\s/g, '');
    if (!cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumberDigits.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    // Validate name
    if (!cardName.trim()) {
      newErrors.cardName = 'Name on card is required';
    }
    
    // Validate expiry date (MM/YY format)
    if (!expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const [month, year] = expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of year
      const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
      
      if (!month || !year || month.length !== 2 || year.length !== 2) {
        newErrors.expiryDate = 'Expiry date must be in MM/YY format';
      } else if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Month must be between 01 and 12';
      } else if (
        (parseInt(year) < currentYear) || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    // Validate CVV (3 or 4 digits)
    if (!cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Save card to localStorage if checkbox is checked
        if (saveCard) {
          const cardData = {
            cardNumber,
            cardName,
            expiryDate,
            // Don't save CVV for security reasons
            lastUpdated: new Date().toISOString()
          };
          localStorage.setItem('savedCard', JSON.stringify(cardData));
        } else {
          localStorage.removeItem('savedCard');
        }
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Process successful payment
        toast.success('Payment successful!');
        
        // Create order record
        const order = {
          id: `ORD-${Date.now()}`,
          items: cart,
          total: total,
          date: new Date().toISOString(),
          paymentMethod: 'Credit Card',
          cardLast4: cardNumber.slice(-4)
        };
        
        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart
        clearCart();
        
        // Redirect to order confirmation
        navigate('/order-confirmation', { state: { order } });
        
      } catch (error) {
        console.error('Payment error:', error);
        toast.error('Payment failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="credit-card-container">
      <div className="credit-card-form-wrapper">
        <h2>Payment Details</h2>
        <p className="payment-total">Total: ${total.toFixed(2)}</p>
        
        <form onSubmit={handleSubmit} className="credit-card-form">
          <div className="form-group">
            <label htmlFor="cardNumber">
              <FaCreditCard className="input-icon" />
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className={errors.cardNumber ? 'error' : ''}
            />
            {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="cardName">
              <FaUser className="input-icon" />
              Name on Card
            </label>
            <input
              type="text"
              id="cardName"
              value={cardName}
              onChange={(e) => {
                setCardName(e.target.value);
                if (errors.cardName) setErrors({...errors, cardName: null});
              }}
              placeholder="John Doe"
              className={errors.cardName ? 'error' : ''}
            />
            {errors.cardName && <div className="error-message">{errors.cardName}</div>}
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="expiryDate">
                <FaCalendarAlt className="input-icon" />
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                maxLength="5"
                className={errors.expiryDate ? 'error' : ''}
              />
              {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
            </div>
            
            <div className="form-group half">
              <label htmlFor="cvv">
                <FaLock className="input-icon" />
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setCvv(value);
                  if (errors.cvv) setErrors({...errors, cvv: null});
                }}
                placeholder="123"
                maxLength="4"
                className={errors.cvv ? 'error' : ''}
              />
              {errors.cvv && <div className="error-message">{errors.cvv}</div>}
            </div>
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="saveCard"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
            />
            <label htmlFor="saveCard">Save card for future purchases</label>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate('/cart')}
              disabled={isSubmitting}
            >
              <FaArrowLeft /> Back to Cart
            </button>
            <button 
              type="submit" 
              className="pay-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
          </div>
        </form>
        
        <div className="secure-payment-info">
          <FaLock className="lock-icon" />
          <p>Your payment information is secure. We use encryption to protect your data.</p>
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;
