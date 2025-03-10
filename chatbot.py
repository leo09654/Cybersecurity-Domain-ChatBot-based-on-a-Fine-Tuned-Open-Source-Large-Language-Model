import requests
import json
import os
from transformers import AutoTokenizer
import torch

class HuggingFaceAPIClient:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.environ.get("HF_API_KEY")
        if not self.api_key:
            raise ValueError("HuggingFace API key is required. Set the HF_API_KEY environment variable or pass it as a parameter.")
        
        self.api_url = "https://api-inference.huggingface.co/models/"
        self.model_name = "shahrukh95/falcon-7b-Set-3-cybersecurity-layered-config"
    
    def set_model(self, model_name):
        """Change the model being used"""
        self.model_name = model_name
        print(f"Model changed to {model_name}")
    
    def generate_response(self, prompt, max_length=256, temperature=0.7):
        """Generate a response using the HuggingFace API"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Format prompt for cybersecurity context
        formatted_prompt = f"You are a cybersecurity expert assistant. Please provide accurate and helpful information about security topics.\n\nUser: {prompt}\n\nAssistant:"
        
        payload = {
            "inputs": formatted_prompt,
            "parameters": {
                "max_length": max_length,
                "temperature": temperature,
                "top_p": 0.9,
                "repetition_penalty": 1.2,
                "return_full_text": False
            }
        }
        
        url = f"{self.api_url}{self.model_name}"
        
        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            
            if isinstance(result, list) and len(result) > 0:
                if "generated_text" in result[0]:
                    return result[0]["generated_text"].split("Assistant:")[-1].strip()
                return result[0]
            
            return str(result)
            
        except requests.exceptions.RequestException as e:
            if response.status_code == 503:
                print("\nModel is loading, switching to backup model...")
                self.set_model("TinyLlama/TinyLlama-1.1B-Chat-v1.0")
                return self.generate_response(prompt, max_length, temperature)
            return f"Error: {str(e)}"

def main():
    print("Initializing Cybersecurity Chatbot (API Version)...")
    print("Connecting to HuggingFace API...")
    
    try:
        # Initialize the API client
        client = HuggingFaceAPIClient()
        print("\nConnection successful!")
        
        print("\nChatbot is ready! You can ask questions about:")
        print("- Cybersecurity best practices")
        print("- Malware and virus protection")
        print("- Network security")
        print("- Security tools and software")
        print("- Common vulnerabilities")
        print("- Security incident response")
        print("- CVE details and analysis")
        print("\nType 'exit' to quit the chatbot.")
        print("Type 'switch model' to change between different models.")
        
        available_models = [
            "shahrukh95/falcon-7b-Set-3-cybersecurity-layered-config",
            "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
        ]
        
        while True:
            question = input("\nYour question: ").strip()
            
            if question.lower() == 'exit':
                break
                
            if question.lower() == 'switch model':
                print("\nAvailable models:")
                for i, model in enumerate(available_models, 1):
                    print(f"{i}. {model}")
                choice = input("\nSelect model number: ").strip()
                try:
                    model_index = int(choice) - 1
                    if 0 <= model_index < len(available_models):
                        client.set_model(available_models[model_index])
                    else:
                        print("Invalid model number.")
                except ValueError:
                    print("Please enter a valid number.")
                continue
            
            if not question:
                print("Please enter a valid question.")
                continue
                
            print("\nGenerating response...")
            response = client.generate_response(question)
            print("\nAnswer:", response)
            
    except Exception as e:
        print(f"\nError: {str(e)}")
        print("\nPlease ensure you have:")
        print("1. Valid HuggingFace API key (set as HF_API_KEY environment variable)")
        print("2. Required packages installed")
        print("3. Stable internet connection")

if __name__ == "__main__":
    main() 