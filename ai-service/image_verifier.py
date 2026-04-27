def verify_image_url(image_url):
    """
    Fallback image verification - no CV2 dependency
    """
    import random
    print(f"Demo image verification for {image_url[:50]}...")
    score = round(random.uniform(0.6, 0.95), 2)
    return {
        "score": score,
        "isReused": random.choice([False, True]),
        "explanation": f"Demo score (random for headless container): {int(score*100)}% authentic"
    }
